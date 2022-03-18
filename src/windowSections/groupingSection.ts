import { horizontal, box, vertical, dropdown, compute, label } from "openrct2-flexui";
import { model } from "../model";

const groupingSectionElements = () =>
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
                                items: compute(model.groupings.all, (g) => g.map((grouping)=>grouping.name)),
                                selectedIndex: model.groupings.selectedIndex,
                                disabled: compute(model.groupings.all, m => m.length === 0),
                                disabledMessage: 'No groupings defined',
                                onChange: (index:number) =>
{
                                    model.groupings.selectedIndex.set(index);
                                    model.groupings.selected.set(model.groupings.all.get()[index]);
                                }
                            }),
                            label({
                            //     height: 75,
                                padding: {top: 10},
                                alignment: 'centred',
                                text: compute(model.groupings.selected, grouping =>
{
                                    if (grouping) return `${grouping.description}`;
                                    return 'No mode selected';
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
