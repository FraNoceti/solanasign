export const splitIntoSmallerParts = (content: Buffer, size: number): Buffer[] => {
    let smallerContents: Buffer[] = [];
    let start = 0;
    while(start <= content.length) {
        smallerContents.push(content.subarray(start, start+size))
        start += size;
    }
    return smallerContents;
}

export const getOffset = (guarantors: number, titleLength: number): number => 
    10 + 34 * guarantors + 4 + titleLength + 4 + 4;