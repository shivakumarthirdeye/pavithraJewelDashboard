export const changeDateFormat=(date)=>{
    const newdate = new Date(date);
    return newdate.toLocaleDateString("en-US");

}