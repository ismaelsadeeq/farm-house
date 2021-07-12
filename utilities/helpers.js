const generateOTP =()=>{
  let value,val;
  value = Math.floor(100000 + Math.random() * 9000000);
  val = value.toString().substring(0, 5);
  return val
}
function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60 * 24);
}
module.exports ={
  generateOTP,
  getDifferenceInDays
}