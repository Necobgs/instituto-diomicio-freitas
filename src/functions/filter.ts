import { iFilterParameters } from "@/types/filter";

export const buildFilterQuery = (params: iFilterParameters[]): string => {
    const filter: any = {};

    params.map(param => {

        if (Array.isArray(param.operator)) {
            filter[param.key] = {};
            param.operator.map((op, i) => {
                if (param.value[i] === undefined || param.value[i] === null || param.value[i] === '' || !op) return;

                if(op === '$ilike' || op === '$like') {
                    param.value[i] = `%${param.value[i]}%`;
                }
                else if (op === '$null') {
                    param.value[i] = param.value[i] == "true" ? true : false;
                }

                filter[param.key][op] = param.value[i];
            });
        }
        else {
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
        }
    });

    return JSON.stringify(filter);
}