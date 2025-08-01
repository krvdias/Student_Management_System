
export function formatMobileNumber(mobile) {
    if (!mobile) return null;
    
    // Remove all non-digit characters
    const digitsOnly = mobile.replace(/\D+/g, '');
    
    // Handle empty string after cleanup
    if (!digitsOnly) return null;
    
    // Check if number starts with country code (94)
    if (digitsOnly.startsWith('94')) {
        // If it's exactly 11 digits (94 + 9 digits), return as is
        if (digitsOnly.length === 11) {
            return digitsOnly;
        }
        // If longer than 11 digits, truncate or handle as needed
        return digitsOnly.length > 11 ? digitsOnly.substring(0, 11) : digitsOnly;
    }
    
    // Handle numbers starting with 0 (local format)
    if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
        return '94' + digitsOnly.substring(1);
    }
    
    // Handle 9-digit numbers (without 0 or country code)
    if (digitsOnly.length === 9) {
        return '94' + digitsOnly;
    }
    
    // For any other format, return as digits only (or handle error)
    return digitsOnly.length > 11 ? digitsOnly.substring(0, 11) : digitsOnly;
};