CREATE TABLE `Products` (
  `ProductID` int,
  `ProductName` nvarchar(40),
  `SupplierID` int,
  `CategoryID` int,
  `QuantityPerUnit` nvarchar(20),
  `UnitPrice` decimal(15,4),
  `UnitsInStock` smallint,
  `UnitsOnOrder` smallint,
  `ReorderLevel` smallint,
  `Discontinued` tinyint,
  PRIMARY KEY (`ProductID`),
  FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID),
  FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

CREATE TABLE `Region` (
  `RegionID` int,
  `RegionDescription` nchar(50),
  PRIMARY KEY (`RegionID`)
);

CREATE TABLE `Territories` (
  `TerritoryID` nvarchar(20),
  `TerritoryDescription` nchar(50),
  `RegionID` int,
  PRIMARY KEY (`TerritoryID`),
  FOREIGN KEY (`RegionID`) REFERENCES Region(RegionID)
);

CREATE TABLE `Employees` (
  `EmployeeID` int,
  `LastName` nvarchar(20),
  `FirstName` nvarchar(10),
  `Title` nvarchar(30),
  `TitleOfCourtesy` nvarchar(25),
  `BirthDate` datetime(3),
  `HireDate` datetime(3),
  `Address` nvarchar(60),
  `City` nvarchar(15),
  `Region` nvarchar(15),
  `PostalCode` nvarchar(10),
  `Country` nvarchar(15),
  `HomePhone` nvarchar(24),
  `Extension` nvarchar(4),
  `Photo` longblob,
  `Notes` longtext,
  `ReportsTo` int,
  `PhotoPath` nvarchar(255),
  PRIMARY KEY (`EmployeeID`),
  FOREIGN KEY (`ReportsTo`) REFERENCES Employees(EmployeeID)
);

CREATE TABLE `EmployeeTerritories` (
  `EmployeeID` int,
  `TerritoryID` nvarchar(20),
  PRIMARY KEY (`EmployeeID`, `TerritoryID`),
  FOREIGN KEY (`EmployeeID`) REFERENCES Employees(EmployeeID),
  FOREIGN KEY (TerritoryID) REFERENCES Territories(TerritoryID)


);

CREATE TABLE `CustomerDemographics`(
    `CustomerTypeID` nchar(10),
    `CustomerDesc` longtext,
    PRIMARY KEY (`CustomerTypeID`)
)
CREATE TABLE `CustomerCustomerDemo`(
    `CustomerID` nchar(5),
    `CustomerTypeID` nchar(10),
    PRIMARY KEY (`CustomerID`,`CustomerTypeID`),
#     PRIMARY KEY (`CustomerTypeID`),
    FOREIGN KEY (`CustomerTypeID`) REFERENCES CustomerDemographics(CustomerTypeID)
)

CREATE TABLE `Customers` (
    `CustomerID` nchar(5),
    `CompanyName` nvarchar(40),
    `ContactName` nvarchar(30),
    `ContactTitle` nvarchar(30),
    `Address` nvarchar(60),
    `City` nvarchar(15),
    `Region` nvarchar(15),
    `PostalCode` nvarchar(10),
    `Country` nvarchar(15),
    `Phone` nvarchar(24),
    `Fax` nvarchar(24),
    PRIMARY KEY (`CustomerID`),
    FOREIGN KEY (`CustomerID`) REFERENCES CustomerCustomerDemo(CustomerID)

)
CREATE TABLE `Shippers` (
    `ShipperID` int,
    `CompanyName` nvarchar(40),
    `Phone` nvarchar(24),
    PRIMARY KEY (`ShipperID`)
)

CREATE TABLE `Orders` (
    `OrderID` int,
    `CustomerID` nchar(5),
    `EmployeeID` int,
    `OrderDate` datetime(3),
    `RequiredDate` datetime(3),
    `ShippedDate` datetime(3),
    `ShipVia` int,
    `Freight` decimal(14,4),
    `ShipName` nvarchar(40),
    `ShipAddress` nvarchar(60),
    `ShipCity` nvarchar(15),
    `ShipRegion` nvarchar(15),
    `ShipPostalCode` nvarchar(10),
    `ShipCountry` nvarchar(15),
    PRIMARY KEY (`OrderID`),
    FOREIGN KEY (`EmployeeID`) REFERENCES Employees(EmployeeID),
    FOREIGN KEY (`CustomerID`) REFERENCES Customers(CustomerID),
    FOREIGN KEY (`ShipVia`) REFERENCES Shippers(ShipperID)

)

CREATE TABLE `OrderDetails`(
    `OrderID` int,
    `ProductID` int,
    `UnitPrice` decimal(15,4),
    `Quantity` smallint,
    `Discount` real,
    PRIMARY KEY (`OrderID`,`ProductID`),
    FOREIGN KEY (`OrderID`) REFERENCES Orders(OrderID),
    FOREIGN KEY (`ProductID`) REFERENCES Products(ProductID)

)


