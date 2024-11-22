export const formatDate = (date: any, showTime: boolean = false) => {
    if (date) {
        const today = new Date(date);
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth()); //January is 0!
        const yyyy = today.getFullYear();
        const monthNames: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let formattedDate = `${dd} ${monthNames[parseInt(mm)]}, ${yyyy}`;

        if (showTime) {
            const hh = String(today.getHours()).padStart(2, '0');
            const min = String(today.getMinutes()).padStart(2, '0');
            const ss = String(today.getSeconds()).padStart(2, '0');
            formattedDate += ` ${hh}:${min}:${ss}`;
        }

        return formattedDate
    }
    return '';
};

export const truncateText = (text: string, charLimit: number) => {
    if (text.length <= charLimit) {
        return text;
    }
    return text.substring(0, charLimit) + '...';
};