import * as Logger from "bunyan";
const R = require("ramda");

export class Tags {

    // Key - TagCategory a string; Value - multiple tags under that category Ex: Env:{Dev,Systemtest}
    public tags: Map<string, Array<string>> = new Map<string, Array<string>>();
    //    public log: Logger = Logger.createLogger({ name: 'vizLinks', level: 'debug' });

    /**
     * Clone the current object so that it can be associated while creating Links or BudNodes
     */
    public clone(): Tags {
        var vTags: Tags = new Tags();
        vTags.addAllTags(this);
        return vTags;
    }

    public toString(): string {
        return "" + this.tags;
    }
    /**
     * Check whether the passed combination of tag category and tag exists
     * @param pTagCategory 
     * @param tag 
     */
    public isTagExists(pTagCategory: string, tag: string): boolean {
        var retValue: boolean = false;
        if (this.tags.get(pTagCategory) != null) {
            // retValue = this.tags.get(pTagCategory).indexOf(tag) === -1 ? false : true;
            retValue = R.contains(tag, this.tags.get(pTagCategory));
        }
        return retValue;
    }

    /**
     * Add the provided tag to the object
     * @param pTagCategory 
     * @param tag 
     */
    public addTag(pTagCategory: string, pTag: string): Tags {
        if (!this.isTagExists(pTagCategory, pTag) && pTag.trim().length > 0) {
            var lTags: string[] = this.tags.get(pTagCategory);
            if (lTags == null) {
                lTags = [];
                this.tags.set(pTagCategory, lTags);
            }
            lTags.push(pTag);
        }

        return this;
    }

    /**
     * -  call isTagExists for each of the pTags[] element. Return true if all tags exists. 
     * @param pTagCategory 
     * @param pTags 
     */
    public isTagsExists(pTagCategory: string, pTags: string[]): boolean {
        return pTags.every((value) => { return this.isTagExists(pTagCategory, value) });
    }

    /**
     *- return true if atleast one string[] object exists 
     */
    public hasTags(): boolean {
        return this.tags.size > 0 ? true : false;
    }


    /**
     * Check whether all the tags in the passed object are present in this object
     * @param pTags 
     */
    public isAllTagsExists(pTags: Tags): boolean {
        // var retValue: boolean[] = [];
        //var iter: IterableIterator<string> = pTags.getAllTags().keys();
        if (this.hasTags() && !pTags.hasTags()) {
            return false; //If passed tags is empty and current object has tags, it should not match
        }

        const condcheck = (curr) => this.isTagsExists(curr[0], pTags.getAllTagsForCategory(curr[0]))

        return R.all(condcheck)(Array.from(pTags.getAllTags()));

        // for (var tagCategory: IteratorResult<string> = iter.next(); !tagCategory.done; tagCategory = iter.next()) {
        //     retValue.push(this.isTagsExists(tagCategory.value, pTags.getAllTagsForCategory(tagCategory.value)));
        // }
        // return retValue.indexOf(false) == -1 ? true : false;
    }

    /**
     *  - return Map as is
     */
    public getAllTags(): Map<string, string[]> {
        return this.tags
    }



    /**
     * - return [] from the map for the key 
     * @param key 
     */
    public getAllTagsForCategory(key: string): string[] {
        return this.tags.get(key);
    }

    /**
     * - For each value item - call this.addTag(key,value[i]) 
     * @param key 
     * @param value 
     */
    public addTags(pTagCategory: string, pTags: string[]): Tags {
        pTags.forEach(tagval => { this.addTag(pTagCategory, tagval); });
        return this;
    }


    /**
     * - need to add all the lTags in the passed object to 'this' object 
     * @param pTag 
     */
    public addAllTags(pTags: Tags) {

        pTags.getAllTags().forEach(
            (value, key, map) => this.addTags(key, pTags.getAllTagsForCategory(key)),
        )
    }


    /**
     * Removes all tags 
     */
    public removeAllTags() {
        this.tags.clear()
    }
}