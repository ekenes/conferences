
interface StatisticsResponse {
   duration: "2.5" | "5" | "7.5" | "10" | string,
   season: "Winter" | "Spring" | "Summer" | "Fall" | string,
   value: number
 } 
  
interface ChartData {
  row: number,
  col: number,
  value: number
}

interface CellHighlight {
  row: number,
  col: number
}