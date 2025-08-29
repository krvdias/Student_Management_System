
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

export function GPACalculator(mark, subjectCount, gpa) {
    if (!mark) return null;
    // Convert mark to float
    const numericMark = parseFloat(mark);
    const subjects = parseFloat(subjectCount);
    const existingGPA = parseFloat(gpa);
    
    // Determine the grade and its value
    let gradeValue = 0;
    
    if (numericMark >= 80 && numericMark <= 100) {
        gradeValue = 4; // A
    } else if (numericMark >= 65 && numericMark < 80) {
        gradeValue = 3; // B
    } else if (numericMark >= 50 && numericMark < 65) {
        gradeValue = 2; // C
    } else if (numericMark >= 35 && numericMark < 50) {
        gradeValue = 1; // D
    } else if (numericMark >= 29 && numericMark < 35) {
        gradeValue = 0; // E
    } else if (numericMark >= 0 && numericMark < 29) {
        gradeValue = 0; // U
    }
    
    // If grade value is 0, ignore this mark (return existing GPA)
    if (gradeValue === 0) {
        return gpa;
    }
    
    // Calculate new GPA
    const calculatedGPA = gradeValue / subjects;
    const newGPA = existingGPA + calculatedGPA;
    
    return newGPA;
};

export function gradeGenerator(mark) {
    if (!mark) return null;

    // Convert mark to float
    const numericMark = parseFloat(mark);

    let grade = '';
    if (numericMark >= 80 && numericMark <= 100) {
        grade = 'A'; 
    } else if (numericMark >= 65 && numericMark < 80) {
        grade = 'B';
    } else if (numericMark >= 50 && numericMark < 65) {
        grade = 'C'; 
    } else if (numericMark >= 35 && numericMark < 50) {
        grade = 'D';
    } else if (numericMark >= 29 && numericMark < 35) {
        grade = 'E';
    } else if (numericMark >= 0 && numericMark < 29) {
        grade = 'U';
    }

    return grade;
};

export function GPACalculatorUpdate(mark, oldMark, subjectCount, gpa) {
    // Convert mark to float
    const numericMark = parseFloat(mark);
    const numericOldMark = parseFloat(oldMark);
    const subjects = parseFloat(subjectCount);
    const existingGPA = parseFloat(gpa);

    let oldGradeValue = 0;
    if (numericOldMark >= 80 && numericOldMark <= 100) {
        oldGradeValue = 4; // A
    } else if (numericOldMark >= 65 && numericOldMark < 80) {
        oldGradeValue = 3; // B
    } else if (numericOldMark >= 50 && numericOldMark < 65) {
        oldGradeValue = 2; // C
    } else if (numericOldMark >= 35 && numericOldMark < 50) {
        oldGradeValue = 1; // D
    } else if (numericOldMark >= 29 && numericOldMark < 35) {
        oldGradeValue = 0; // E
    } else if (numericOldMark >= 0 && numericOldMark < 29) {
        oldGradeValue = 0; // U
    }

    if (oldGradeValue !== 0) {
        const oldGPA = oldGradeValue / subjectCount;
        const changedGPA = existingGPA - oldGPA; 

        // Determine the grade and its value
        let gradeValue = 0;
        
        if (numericMark >= 80 && numericMark <= 100) {
            gradeValue = 4; // A
        } else if (numericMark >= 65 && numericMark < 80) {
            gradeValue = 3; // B
        } else if (numericMark >= 50 && numericMark < 65) {
            gradeValue = 2; // C
        } else if (numericMark >= 35 && numericMark < 50) {
            gradeValue = 1; // D
        } else if (numericMark >= 29 && numericMark < 35) {
            gradeValue = 0; // E
        } else if (numericMark >= 0 && numericMark < 29) {
            gradeValue = 0; // U
        }
        
        // If grade value is 0, ignore this mark (return existing GPA)
        if (gradeValue === 0) {
            return changedGPA;
        }
        
        // Calculate new GPA
        const calculatedGPA = gradeValue / subjects;
        const newGPA = changedGPA + calculatedGPA;
        
        return newGPA;
    }
};

export function avarageCalculator(mark, subjectCount, avarage) {
    if(!mark) return null;

    const numericMark = parseFloat(mark);
    const subjects = parseFloat(subjectCount);
    const existingAvarage = parseFloat(avarage);

    if (numericMark === 0) {
        return avarage;
    }

    const calculatedAvarage = numericMark / subjects;
    const newAvarage = existingAvarage + calculatedAvarage;

    return newAvarage;
};

export function avarageCalculatUpdate(mark, oldMark, subjectCount, avarage) {

    const numericMark = parseFloat(mark);
    const numaricOldMark = parseFloat(oldMark);
    const subjects = parseFloat(subjectCount);
    const existingAvarage = parseFloat(avarage);

    if (numaricOldMark !== 0) {
        const oldAvarage = numaricOldMark / subjects;
        const changeAvarage = existingAvarage - oldAvarage;

        if (numericMark === 0) {
            return changeAvarage;
        }

        const calculatedAvarage = numericMark / subjects;
        const newAvarage = changeAvarage + calculatedAvarage;

        return newAvarage;
    }
};

export function calculateFees(amount, discount) {
    const numaricAmount = parseFloat(amount);

    //if there is no discount return same amount
    if (!discount) {
        return numaricAmount;
    }

    const numaricDiscount = parseInt(discount);

    //calculate discounted amount accoding to discount precentage
    const discountAmount = (numaricAmount * numaricDiscount) / 100;

    //get final amount 
    const finalAmount = numaricAmount - discountAmount;

    return finalAmount;
}

export function checkCurrentTerm() {
    const today = new Date();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed (0-11)
    const year = today.getFullYear();
    
    if (month >= 9 && month <= 12) {
        return { term: "1st Term", year: year };
    } else if (month >= 1 && month <= 4) {
        return { term: "2nd Term", year: year };
    } else if (month >= 5 && month <= 8) {
        return { term: "3rd Term", year: year };
    } else {
        // This shouldn't happen as all months are covered, but just in case
        return { term: "Unknown Term", year: year };
    }
}