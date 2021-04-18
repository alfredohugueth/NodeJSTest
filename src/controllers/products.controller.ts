/* Functional Imports*/
import { request, Request, Response } from "express";
import HttpStatusCode from "../interface/HttpStatusCode";

/* Database Import*/
import { connect } from "./database";

/* Querys */
import Querys from "../querys/products.query";

/* Interfaces */


import Query from "mysql2/typings/mysql/lib/protocol/sequences/Query";


export class ProductsController{
    /* Route for GET /api/products? */


 listProductsWithCategoriesByID=async(req: Request, res: Response)=> {

    if (req.body.hasOwnProperty('page') && req.body.hasOwnProperty('length') && req.body.hasOwnProperty('order')) await verifyParametersListProductsByID(req, res);
    else sendStatusFailListProductsByID(req, res);

}

/* Route for GET /api/products/search? */


 searchProductsByNameCategoryOrSupplier= async(req: Request, res: Response)=> {
    if (req.body.hasOwnProperty('productName') || req.body.hasOwnProperty('categoryName') || req.body.hasOwnProperty('supplierName')) await verifyParametersSearchByProductCategorySupplierName(req, res);
    else sendStatusFailSearchProductsByNameCategoryOrSupplier(req, res);
}


/* Route for GET /api/products/:id*/

 searchProductByID= async (req: Request, res: Response)=> {
    //Verify if the param id its in the url requested
    
    if (req.params.hasOwnProperty('id')) await queryProductByID(req, res);
    else sendStatusFailQueryProductsByID(req, res);

}

/* Route for POST /api/products */

 createNewProduct= async(req:Request,res:Response)=> {
    /* Verify that the request send has the format */
    let params = req.body;
    if(params.hasOwnProperty('categoryID') && params.hasOwnProperty('discontinued') && params.hasOwnProperty('productName') && params.hasOwnProperty('quantityPerUnit')
    && params.hasOwnProperty('reorderLevel') && params.hasOwnProperty('supplierID') && params.hasOwnProperty('unitPrice') && params.hasOwnProperty('unitsInStock')
    && params.hasOwnProperty('unitsOnOrder')) await testTypesOfDatas(req,res,params)
    else sendStatusFailInsertProducts(req,res);

}

}


/*Functions for make the querys */

/* Functions for GET /api/products?*/

/* Send Status fail*/
function sendStatusFailListProductsByID(req: Request, res: Response) {
    let format = {

        'page': 1,
        'length': 5,
        'order': (`ASC | DESC`)

    }
    res.statusCode = HttpStatusCode.BAD_REQUEST;
    res.json({
        'Status': 'Fail',
        'Description': `No correct data posted, please insert data in this format:`,
        'format': format

    })

}

async function verifyParametersListProductsByID(req: Request, res: Response) {

    if (typeof (req.body.page) == 'number' && typeof (req.body.length) == 'number' && (req.body.order == 'ASC' || req.body.order == 'DESC')) await sendQueryListProductsByID(req, res);
    else sendStatusFailListProductsByID(req, res);


}

async function sendQueryListProductsByID(req: Request, res: Response): Promise<Response> {

    /* Extract page that user want to see*/
    let page: number = req.body.page;

    /* Extract the desired length of the page */
    let length: number = req.body.length;

    /* Extract the order that the user desired -- ASC or DES*/
    let order = req.body.order;

    let condition = ` ORDER BY p.ProductID ${order} LIMIT ? OFFSET ?`
    let query = Querys.querysendQueryListProductsByID + condition


    /* Connecting to database*/
    try {
        const connection = await connect();

        /* First query for obtain the total of pages of the result query */

        const resultQuery = await connection.query(Querys.queryNumberRowsProducts);
        const totalRows: any = resultQuery[0];
        const total: any = {
            total: totalRows[0].total
        }

        let offset: number = (page - 1) * 5;


        /* Then query for items of products */
        const items: any = await connection.query(query, [length, offset]);



        /* To desired format */

        var answer = {
            'currentPage': page,
            'items': [],
            'perPage': length,
            'total': total.total
        }

        answer = transformToFormat(answer, items);
        res.statusCode = HttpStatusCode.OK;
        return res.json(answer);
    } catch (err) {
        console.log(err);
        sendCatchFailure(req, res);
    }


}



/* Functions for GET /api/products/search?*/

function transformToFormat(data, items) {
    if (data.hasOwnProperty('items')) {

        for (let item of items[0]) {
            data.items.push({
                "category": {
                    "description": item.Description,
                    "id": item.CategoryID,
                    "name": item.CategoryName,
                    "picture": item.picture
                },
                "discontinued": item.Discontinued,
                "id": item.ProductID,
                "productName": item.ProductName,
                "quantityPerUnit": item.QuantityPerUnit,
                "reorderLevel": item.ReorderLevel,
                "supplier": {
                    "address": {
                        "city": item.city,
                        "country": item.country,
                        "phone": item.phone,
                        "postalCode": 70117,
                        "region": item.region,
                        "street": item.street
                    },
                    "companyName": item.companyName,
                    "contactName": item.contactName,
                    "contactTitle": item.contactTitle,
                    "id": item.id
                },
                "unitPrice": 22,
                "unitsInStock": 53,
                "unitsOnOrder": 0
            }

            )
        }



    } else {

        for (let item of items[0]) {
            data.push(
                {
                    "category": {
                        "description": item.description,
                        "id": item.CategoryID,
                        "name": item.name,
                        "picture": item.picture
                    },
                    "discontinued": item.discontinued,
                    "id": item.ProductID,
                    "productName": item.productName,
                    "quantityPerUnit": item.quantityPerUnit,
                    "reorderLevel": item.reorderLevel,
                    "supplier": {
                        "address": {
                            "city": item.city,
                            "country": item.country,
                            "phone": item.phone,
                            "postalCode": item.postalCode,
                            "region": item.region,
                            "street": item.street
                        },
                        "companyName": item.companyName,
                        "contactName": item.contactName,
                        "contactTitle": item.contactTitle,
                        "id": item.SupplierID
                    },
                    "unitPrice": item.unitPrice,
                    "unitsInStock": item.unitsInStock,
                    "unitsOnOrder": item.UnitsOnOrder
                }
            )
        }



    }
    return data;
}

async function verifyParametersSearchByProductCategorySupplierName(req: Request, res: Response) {
    /* Verify wich param its in the body */
    let productName = '';
    let categoryName = '';
    let supplierName = '';
    if (req.body.hasOwnProperty('productName')) productName = req.body.productName;
    if (req.body.hasOwnProperty('categoryName')) categoryName = req.body.categoryName;
    if (req.body.hasOwnProperty('supplierName')) supplierName = req.body.supplierName;


    /* Query for resolve the task  */
    if(typeof(productName) == 'string' &&  typeof(categoryName) == 'string' && typeof(supplierName) == 'string') await tryCatchSearchProducts(req,res,productName,categoryName,supplierName)

}

async function tryCatchSearchProducts(req:Request,res:Response,productName:String,categoryName:String,supplierName:String) {
    try { await sendQuerySearchByProductCategorySupplierName(req, res, productName, categoryName, supplierName) }
    catch (err) {
        console.log(err);
        sendCatchFailure(req, res);

    }
}
async function sendQuerySearchByProductCategorySupplierName(req: Request, res: Response, productName: String, categoryName: String, supplierName: String) {

    const connection = await connect();
    /* Send query and make the format */
    const search: any = await connection.query(Querys.sendQuerySearchByProductCategorySupplierName, [productName, categoryName, supplierName]);
    let response = []

    /*Transform response to desired format */

    response = transformToFormat(response,search);
    res.statusCode = HttpStatusCode.OK;
    res.json(response);

}

function sendCatchFailure(req: Request, res: Response) {
    res.statusCode = HttpStatusCode.BAD_GATEWAY;
    res.json({
        'status': 'Fail',
        'Description': 'Error Connecting database for the query'
    })
}

async function sendStatusFailSearchProductsByNameCategoryOrSupplier(req: Request, res: Response) {
    res.statusCode = HttpStatusCode.BAD_REQUEST;
    let format = {
        'productName': 'Example product name as string',
        'categoryName': 'Example category name as string',
        'supplierName': 'Example Supplier name as string'
    }
    res.json({
        'Status': 'Fail',
        'Description': `No correct data posted, please insert data that at least one of this params`,
        'format': format
    })
}


/* Functions for GET /api/products/:id*/

async function queryProductByID(req: Request, res: Response) {
    let id = parseInt(req.params.id);
    if(isNaN(id)) sendStatusFailQueryProductsByID(req,res)
    else try { await productsByID(res, id) } catch (err) { console.log(err); sendCatchFailure(req, res) };
}

async function productsByID(res: Response, id: Number) {
    const connection = await connect();
    let inter:any = await connection.query(Querys.productsByID, [id]); 
    let item = (inter[0])[0];
    
    /* Transform to desierd format*/
    let response = []
    //response = transformToFormat(response, item[0])
    response.push(
        {
            "category": {
                "description": item.description,
                "id": item.CategoryID,
                "name": item.name,
                "picture": item.picture
            },
            "discontinued": item.discontinued,
            "id": item.ProductID,
            "productName": item.productName,
            "quantityPerUnit": item.quantityPerUnit,
            "reorderLevel": item.reorderLevel,
            "supplier": {
                "address": {
                    "city": item.city,
                    "country": item.country,
                    "phone": item.phone,
                    "postalCode": item.postalCode,
                    "region": item.region,
                    "street": item.street
                },
                "companyName": item.companyName,
                "contactName": item.contactName,
                "contactTitle": item.contactTitle,
                "id": item.SupplierID
            },
            "unitPrice": item.unitPrice,
            "unitsInStock": item.unitsInStock,
            "unitsOnOrder": item.UnitsOnOrder
        }

    )
    res.statusCode = HttpStatusCode.OK;
    res.json(response);


}

function sendStatusFailQueryProductsByID(req: Request, res: Response) {
    res.statusCode = HttpStatusCode.BAD_REQUEST;
    let format = '/api/products/(theIdYouWantToSearch)'
    res.json({
        'Status': 'Fail',
        'Description': `Please insert the id in the url like this`,
        'format': format
    })
}


/* functions for post /api/products*/

function sendStatusFailInsertProducts(req:Request,res:Response){
    res.statusCode = HttpStatusCode.BAD_REQUEST;
    let format = {
        "categoryID": 3,
        "discontinued": true,
        "productName": "Chef Anton's Cajun Seasoning",
        "quantityPerUnit": "48 - 6 oz jars",
        "reorderLevel": 0,
        "supplierID": 2,
        "unitPrice": 22,
        "unitsInStock": 53,
        "unitsOnOrder": 0 
    }
    res.json({
        'Status': 'Fail',
        'Description': `Please insert the data in this format`,
        'format': format
    });
}

async function testTypesOfDatas(req:Request,res:Response,params){
    if(typeof(params.productName) == 'string' && typeof(params.supplierID) == 'number' && typeof(params.categoryID) == 'number' 
    && typeof(params.quantityPerUnit) == 'number' && typeof(params.unitPrice) == 'number' && typeof(params.unitsInStock) == 'number' && typeof(params.unitsOnOrder) == 'number' 
    && typeof(params.reorderLevel) == 'number' && typeof(params.discontinued)=='boolean')/* End of If Statement*/try{insertProduct(req,res,params)}catch{sendStatusFailInsertProducts(req,res)}
    else sendStatusFailInsertProducts(req,res);

    
    
}

async function insertProduct(req:Request,res:Response,params) {
    const connection = await connect();
    let values = [params.productName,params.supplierID,params.categoryID,
        params.quantityPerUnit,params.unitPrice,params.unitsInStock,params.unitsOnOrder,params.reorderLevel,params.discontinued]
    
    await connection.query(Querys.insertProduct, values);
    res.statusCode = HttpStatusCode.OK
    res.json({
        'status':'Success',
        'description':'Data Inserted correctly'
    })

    
}






