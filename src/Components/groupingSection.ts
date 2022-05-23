import { horizontal, box, vertical, dropdown, compute, label } from "openrct2-flexui";
import { GroupingController } from '../controllers/BaseController';

const groupingSectionElements = (groupingController: GroupingController) =>
{
    const layout =
    horizontal({
        height: 80,
        content:[
            // GROUP PICKER
            box({
                text: '3. Paint rides together by group: (optional)',
                content:
                    vertical({
                        padding: 5,
                        spacing: 10,
                        content: [
                            dropdown({
                                padding: {top: 5},
                                items: compute(groupingController.all, (g) => g.map((grouping)=>grouping.name)),
                                selectedIndex: groupingController.selectedIndex,
                                disabled: compute(groupingController.all, m => m.length === 0),
                                disabledMessage: 'No groupings defined',
                                onChange: (index:number) =>
                                {
                                    groupingController.selectedIndex.set(index);
                                    groupingController.selected.set(groupingController.all.get()[index]);
                                }
                            }),
                            label({
                            //     height: 75,
                                padding: {top: 10},
                                alignment: 'centred',
                                text: compute(groupingController.selected, grouping =>
                                {
                                    if (!grouping) return "Error: grouping undefined";
                                    return `${grouping.description}`;
                                })
                            })
                        ]
                    })
                }),
            ]
        })

    return layout;
}

export default groupingSectionElements
