
enum Querys {
    queryNumberRowsProducts=`
    (SELECT *   FROM (
        SELECT COUNT(*) AS total
        FROM (SELECT ProductName FROM Products
            INNER JOIN Categories C on Products.CategoryID = C.CategoryID
            INNER JOIN Suppliers S on Products.SupplierID = S.SupplierID
            ) as contador
    
    )as items
    );
    `,

querysendQueryListProductsByID =`
            SELECT p.ProductID,
                      p.ProductName,
                      p.UnitsOnOrder,
                      p.QuantityPerUnit,
                      p.Discontinued,
                      p.ReorderLevel,
                      p.UnitPrice,
                      p.UnitsInStock,
                      p.CategoryID,
                      c.CategoryName,
                      c.Description,
                      TO_BASE64(c.Picture) as picture,
                      s.CompanyName as companyName,
                      s.ContactName as contacName,
                      s.ContactTitle as contactTitle,
                      s.SupplierID as id,
                      s.City as city,
                      s.Country as country,
                      s.Phone as phone,
                      s.PostalCode as postalCode,
                      s.Region as region,
                      s.Address as street
                      FROM Products p, Categories c, Suppliers s 
                      WHERE  p.CategoryID=c.CategoryID and p.SupplierID=s.SupplierID
    
`
,
sendQuerySearchByProductCategorySupplierName = `
SELECT
    c.CategoryName AS name,
    c.Description AS description,
    c.CategoryID,
    TO_BASE64(c.Picture) AS picture,
    p.Discontinued ,
    p.ProductID,
    p.ProductName AS productName,
    p.QuantityPerUnit AS quantityPerUnit,
    p.ReorderLevel AS reorderLevel,
    s.City AS city,
    s.Country AS country,
    s.Phone AS phone,
    s.PostalCode AS postalCode,
    s.Region AS region,
    s.Address AS street,
    s.CompanyName AS companyName,
    s.ContactName AS contactName,
    s.ContactTitle AS contacTitle,
    s.SupplierID,
    p.UnitPrice AS unitPrice,
    p.UnitsInStock AS unitsInStock,
    p.UnitsOnOrder AS unitsOnOrder 
    FROM Categories c, Products p, Suppliers s 
    WHERE ((p.ProductName = ? or c.CategoryName= ? or s.CompanyName=?) 
    and p.CategoryID=c.CategoryID and p.SupplierID = s.SupplierID)
`

,
productsByID = `
SELECT
       c.CategoryName AS name,
       c.Description AS description,
       c.CategoryID,
       TO_BASE64(c.Picture) AS picture,
       p.Discontinued AS discontinued,
       p.ProductID,
       p.ProductName AS productName,
       p.QuantityPerUnit AS quantityPerUnit,
       p.ReorderLevel AS reorderLevel,
       s.City AS city,
       s.Country AS country,
       s.Phone AS phone,
       s.PostalCode AS postalCode,
       s.Region AS region,
       s.Address AS street,
       s.CompanyName AS companyName,
       s.ContactName AS contactName,
       s.ContactTitle AS contacTitle,
       s.SupplierID,
       p.UnitPrice AS unitPrice,
       p.UnitsInStock AS unitsInStock,
       p.UnitsOnOrder AS unitsOnOrder
FROM Products p, Categories c, Suppliers s
WHERE p.ProductID =? AND p.SupplierID = s.SupplierID AND p.CategoryID=c.CategoryID
    
`,

insertProduct='INSERT INTO Products (ProductName,SupplierID,CategoryID,QuantityPerUnit,UnitPrice,UnitsInStock,UnitsOnOrder,ReorderLevel,Discontinued) VALUES(?,?,?,?,?,?,?,?,?)'

}

export default Querys
