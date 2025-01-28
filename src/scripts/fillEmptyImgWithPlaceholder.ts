function fillEmptyImgWithPlaceholder<Type extends {img?: string}>(objArr: Array<Type>, placeholders: Array<string>): Array<Type> {
    return objArr.map((obj, i) => {
        if (!obj.img) {
            const replacementImg = placeholders[i % placeholders.length];
            return {
                ...obj,
                img: replacementImg,
            }
        }
        return obj;
    })
}

export default fillEmptyImgWithPlaceholder;