CREATE TABLE [dbo].[Event]
(
	[Id] INT NOT NULL IDENTITY,
    [Hour] NCHAR(10) NULL, 
    [Name] NVARCHAR(50) NULL, 
    [Description] NVARCHAR(MAX) NULL, 
    [Date] DATE NOT NULL, 
    [Checked] BIT NOT NULL DEFAULT 0
    
)
