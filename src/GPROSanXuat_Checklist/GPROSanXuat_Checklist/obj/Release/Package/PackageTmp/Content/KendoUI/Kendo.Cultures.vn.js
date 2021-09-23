kendo.cultures["vn"] = {
    //<language code>-<country/region code>
    name: "vn",
    // "numberFormat" defines general number formatting rules
    numberFormat: {
        //numberFormat has only negative pattern unlike the percent and currency
        //negative pattern: one of (n)|-n|- n|n-|n -
        pattern: ["-n"],
        //number of decimal places
        decimals: 2,
        //string that separates the number groups (1,000,000)
        ",": ",",
        //string that separates a number from the fractional point
        ".": ".",
        //the length of each number group
        groupSize: [3],
        //formatting rules for percent number
        percent: {
            //[negative pattern, positive pattern]
            //negativePattern: one of -n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %
            //positivePattern: one of n %|n%|%n|% n
            pattern: ["-n %", "n %"],
            //number of decimal places
            decimals: 2,
            //string that separates the number groups (1,000,000 %)
            ",": ",",
            //string that separates a number from the fractional point
            ".": ".",
            //the length of each number group
            groupSize: [3],
            //percent symbol
            symbol: "%"
        },
        currency: {
            //[negative pattern, positive pattern]
            //negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
            //positivePattern: one of "$n|n$|$ n|n $"
            pattern: ["($n)", "$n"],
            //number of decimal places
            decimals: 2,
            //string that separates the number groups (1,000,000 $)
            ",": ",",
            //string that separates a number from the fractional point
            ".": ".",
            //the length of each number group
            groupSize: [3],
            //currency symbol
            symbol: "$"
        }
    },
    calendars: {
        standard: {
            days: {
                // full day names
                names: ["Chủ nhật", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                // abbreviated day names
                namesAbbr: ["CN", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                // shortest day names
                namesShort: [ "CN", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
            },
            months: {
                // full month names
                names: ["Tháng 1", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                // abbreviated month names
                namesAbbr: ["T1", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            // AM and PM designators
            // [standard,lowercase,uppercase]
            AM: [ "SA", "sa", "SA" ],
            PM: [ "CH", "ch", "CH" ],
            // set of predefined date and time patterns used by the culture.
            patterns: {
                d: "M/d/yyyy",
                D: "dddd, MMMM dd, yyyy",
                F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                g: "M/d/yyyy h:mm tt",
                G: "M/d/yyyy h:mm:ss tt",
                m: "MMMM dd",
                M: "MMMM dd",
                s: "yyyy'-'MM'-'ddTHH':'mm':'ss",
                t: "h:mm tt",
                T: "h:mm:ss tt",
                u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                y: "MMMM, yyyy",
                Y: "MMMM, yyyy"
            },
            // the first day of the week (0 = Sunday, 1 = Monday, etc)
            firstDay: 0
        }
    }
};