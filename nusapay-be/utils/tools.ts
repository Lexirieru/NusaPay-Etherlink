// export const formatDate = () => {
//     const now = new Date();
//     const pad = (n) => String(n).padStart(2, '0');
  
//     const year = now.getFullYear();
//     const month = pad(now.getMonth() + 1); // getMonth() dari 0–11
//     const day = pad(now.getDate());
  
  
//     // Hasil: "20250501"
//     const docId = `${year}-${month}-${day}`;
//     // console.log(docId)
//     return docId;
// }

// export const parseMinutesFromTimeString = (timeString) => {
//   const [timePart, meridianRaw] = timeString.split(" ");
//   const meridian = meridianRaw.toUpperCase(); // Biar aman
//   let [hour, minute] = timePart.split(":").map(str => parseInt(str, 10));
  
//   if (meridian === "PM" && hour !== 12) {
//       hour += 12;
//   } else if (meridian === "AM" && hour === 12) {
//       hour = 0;
//   }
//   const minutes = (hour * 60) + minute;
//   return minutes; // misalnya 1331 untuk "10:11 PM"f
// } 
  
// export const formatTime = () => {
//     const now = new Date();
//     const pad = (n) => String(n).padStart(2, '0');
  
//     const hour = now.getHours();
//     const minute = pad(now.getMinutes());
//     const second = pad(now.getSeconds());
  
//     // Hasil: "20250501"
//     const docId = `${hour}-${minute}-${second}`;
//     // console.log(docId)
//     return docId;
//   }