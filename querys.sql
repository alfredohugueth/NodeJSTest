
SELECT *, round((data_length + index_length)) as `totalPages` FROM Orders ORDER BY OrderID ASC LIMIT 20 OFFSET 0;
SET @TotalRows= (SELECT *   FROM (
                    SELECT COUNT(*) AS total
                    FROM (SELECT ProductName FROM Products
                        INNER JOIN Categories C on Products.CategoryID = C.CategoryID
                        INNER JOIN Suppliers S on Products.SupplierID = S.SupplierID
                        ) as contador

                )as items
                );



SELECT * FROM
    Products INNER JOIN Categories C on Products.CategoryID = C.CategoryID
        INNER JOIN Suppliers S on Products.SupplierID = S.SupplierID
        ORDER BY ProductID ASC LIMIT 5 OFFSET 0



SELECT * FROM(
             (SELECT  p.ProductID,
                      p.ProductName,
                      p.UnitsOnOrder,
                      p.QuantityPerUnit,
                      p.Discontinued,
                      p.ReorderLevel,
                      p.UnitPrice,
                      p.UnitsInStock,
                      p.CategoryID,
                      category.CategoryName,
                      category.Description,
                      TO_BASE64(category.Picture),
                      supplier.companyName,
                      supplier.contacName,
                      supplier.contactTitle,
                      supplier.id,
                      supplier.city,
                      supplier.country,
                      supplier.phone,
                      supplier.postalCode,
                      supplier.region,
                      supplier.street




             FROM((SELECT p.ProductID,
                      p.ProductName,
                      p.UnitsOnOrder,
                      p.QuantityPerUnit,
                      p.Discontinued,
                      p.ReorderLevel,
                      p.UnitPrice,
                      p.UnitsInStock,
                      p.CategoryID from Products p, Categories c, Suppliers s where p.CategoryID=c.CategoryID and p.SupplierID=s.SupplierID ) as p,
                  ((SELECT c.Picture, c.Description,c.CategoryName FROM Categories c, Products p where c.CategoryID=p.CategoryID) as category),
                  (SELECT * FROM (((SELECT s.CompanyName as companyName, s.ContactName as contacName, s.ContactTitle as contactTitle, s.SupplierID as id FROM Suppliers s, Products p WHERE s.SupplierID = p.SupplierID) as data),(SELECT s.City as city, s.Country as country, s.Phone as phone,s.PostalCode as postalCode,s.Region as region,s.Address as street from Suppliers s, Products p where s.SupplierID = p.SupplierID) AS address)
                       ) as supplier)
                 )AS items);


SELECT * FROM(
             ((SELECT * from Products P INNER JOIN Categories C on P.CategoryID = C.CategoryID)AS categories),
             ((SELECT * from Products P INNER JOIN Suppliers S on P.SupplierID = S.SupplierID) AS suppliers)
                 )






# s.City, s.Country, s.Phone, s.PostalCode,s.Region,s.Address

# p.ProductID,
#                      p.ProductName,
#                      p.UnitsOnOrder,
#                      p.QuantityPerUnit,
#                      p.Discontinued,
#                      p.ReorderLevel,
#                      p.UnitPrice,
#                      p.UnitsInStock,
#                      p.UnitsOnOrder


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
                      TO_BASE64(c.Picture),
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
FROM Products p, Categories c, Suppliers s WHERE  p.CategoryID=c.CategoryID and p.SupplierID=s.SupplierID ORDER BY p.ProductID ASC LIMIT 5 OFFSET 0




SELECT c.CategoryName AS name,
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

FROM Categories c, Products p, Suppliers s WHERE ((p.ProductName = 'Chai' or c.CategoryName='' or s.CompanyName='') and p.CategoryID=c.CategoryID and p.SupplierID = s.SupplierID)


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
WHERE p.ProductID =1 AND p.SupplierID = s.SupplierID AND p.CategoryID=c.CategoryID


ALTER TABLE Products MODIFY ProductID int not null auto_increment;

ALTER TABLE OrderDetails ADD FOREIGN KEY (ProductID) REFERENCES Products(ProductID);