'use strict';

//隐藏手机号中间4位
function hiddenPhone(phone) {
    if (phone.length === 11) {
        return `${phone.substring(0, 3)}****${phone.substring(7, 11)}`;
    } else {
        return "****";
    }
}

//隐藏邮箱号中间4位
function hiddenEmail(email) {
    let index = email.indexOf('@');
    let head = email.substring(0, index);
    let tail = email.substring(index, email.length);
    if (index < 5) return `****${tail}`;
    else {
        let number = (head.length - 4) / 2;
        number = parseInt(number.toString());
        if (head.length % 4 === 0 || head.length % 4 === 2)
            return `${head.substring(0, number)}****${head.substring(head.length - number, head.length)}${tail}`;
        else
            return `${head.substring(0, number)}****${head.substring(head.length - number - 1, head.length)}${tail}`;
    }
}

module.exports = {hiddenPhone, hiddenEmail};
