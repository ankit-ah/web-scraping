// Function to get date in '2025-04-15 10:50' format
const dateTransform = () => {
  const date = new Date();
  const hrs = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd} ${hrs}:${min}`;
};

// Function to get date in '2025-04-15' format
const getDate = () => {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };
  
module.exports = {dateTransform,getDate}