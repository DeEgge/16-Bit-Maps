setwd("E:\\Eigene Dokumente\\Geodaten\\Terranigma")

# Packages installieren
#install.packages("devtools")
#install.packages("ggmap")
#install.packages("sp")
#install.packages("rgdal")
#require(devtools)
require(ggmap)
require(sp)
require(rgdal)
#install_github("rCharts","ramnathv")
require(rCharts)

# Rohdaten laden
points = read.csv("points.csv", header=TRUE, sep=";", encoding="latin1", stringsAsFactors=FALSE)

# geoJSON erzeugen
pointsSP = SpatialPointsDataFrame(points[,c(3,4)], as.data.frame(points[,2]))  # erst ein SP-Format erzeugen
writeOGR(pointsSP, "terraPoints.js", "points", driver="GeoJSON")
