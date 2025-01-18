export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        day: 'numeric',  // Day of the month
        month: 'short',   // Full month name
        year: 'numeric'  // Full year
    });
};