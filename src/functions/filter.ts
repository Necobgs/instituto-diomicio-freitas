import { iFilterParameters } from "@/types/filter";

export const buildFilterQuery = (params: iFilterParameters[]): string => {
    const filter: any = {};

    params.map(param => {
        if (param.value === undefined || param.value === null || param.value === '' || !param.operator) return;

        if(param.operator === '$ilike' || param.operator === '$like') {
            param.value = `%${param.value}%`;
        }
        else if (param.operator === '$null') {
            param.value = param.value == "true" ? true : false;
        }

        filter[param.key] = {
            [param.operator]: param.value,
        };
    });

    return JSON.stringify(filter);
}