/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
// groupings which will make rides get themed together

import { debug } from "./helpers/logger"

// individual (all rides will be themed individually)
// by:
    // ride type => ride.type
    // ride cost => ride.price[0], [[0-2),[2-4),[4-6),[6-8),[8-10),[10-12),[12-14),[14-16),[18-20),[20+]]
    // ride age => ride.age, [<5, <13, <40, <88,<104, <120, <128, <200, >200 months]
    // ride excitement, intensity, nausea, [0-2, 2-4, 4-6, 6-8, 8-10, 10-12, 12-14, 14+]


export interface Grouping<T extends string | number > {
	readonly name: string
	description: string
    applyGrouping(selectedRides: Ride[],options?: { [key: string]: any }): {[k in T]: Ride[]}
    cohorts: {
        [k in T]: Ride[]
    }
}

const GroupIndividually: Grouping<number> ={
    name: "None (default)",
    description: "Paint each ride individually",
    cohorts: [],
    applyGrouping(selectedRides) {
        this.cohorts = []
        selectedRides.forEach(ride => {
            this.cohorts[ride.id] = [ride]
        })
        return this.cohorts
    }
}

type GroupByCostCohort =  "Free" | "0-2" | "2-4"| "4-6"| "6-8"| "8-10"| "10-12"| "12-14"| "14-16"| "16-18"| "18-20"| "20+"

const GroupByCost: Grouping<GroupByCostCohort> = {
    name: "Ride cost",
    description: "Group rides by $2 cost intervals",
    cohorts: {
        "Free": [],
        "0-2": [],
        "2-4": [],
        "4-6": [],
        "6-8": [],
        "8-10": [],
        "10-12": [],
        "12-14": [],
        "14-16": [],
        "16-18": [],
        "18-20": [],
        "20+": [],
    },
    applyGrouping(selectedRides) {
        this.cohorts.Free = selectedRides.filter(ride => ride.price[0] === 0)
        this.cohorts["0-2"] = selectedRides.filter(ride => (ride.price[0] >= 0 && ride.price[0] < 20))
        this.cohorts["2-4"] = selectedRides.filter(ride => (ride.price[0] >= 20 && ride.price[0] < 40))
        this.cohorts["4-6"] = selectedRides.filter(ride => (ride.price[0] >= 40 && ride.price[0] < 60))
        this.cohorts["6-8"] = selectedRides.filter(ride => (ride.price[0] >= 60 && ride.price[0] < 80))
        this.cohorts["8-10"] = selectedRides.filter(ride => (ride.price[0] >= 80 && ride.price[0] < 100))
        this.cohorts["10-12"] = selectedRides.filter(ride => (ride.price[0] >= 100 && ride.price[0] < 120))
        this.cohorts["12-14"] = selectedRides.filter(ride => (ride.price[0] >= 120 && ride.price[0] < 140))
        this.cohorts["14-16"] = selectedRides.filter(ride => (ride.price[0] >= 140 && ride.price[0] < 160))
        this.cohorts["16-18"] = selectedRides.filter(ride => (ride.price[0] >= 140 && ride.price[0] < 180))
        this.cohorts["18-20"] = selectedRides.filter(ride => (ride.price[0] >= 180 && ride.price[0] < 200))
        this.cohorts["20+"] = selectedRides.filter(ride => (ride.price[0] >= 200))
        return this.cohorts
    }
}

type GroupByAgeCohort =
    "0-4 months old" |
    "5-12 months old" |
    "13-39 months old" |
    "40-87 months old" |
    "88-103 months old" |
    "104-119 months old"  |
    "120-127 months old" |
    "128-199 months old" |
    "200+ months old"

const GroupByAge: Grouping<GroupByAgeCohort> = {
    name: "Ride age",
    description: "Group rides by age intervals matching how much guests are willing to pay; e.g. 0-4 mo, 5-12 mo, 13-39 mo, etc.",
    cohorts: {
        "0-4 months old": [],
        "5-12 months old": [],
        "13-39 months old": [],
        "40-87 months old": [],
        "88-103 months old": [],
        "104-119 months old":  [],
        "120-127 months old": [],
        "128-199 months old": [],
        "200+ months old": [],
    },
    applyGrouping(selectedRides) {
        selectedRides.forEach(ride=>debug(`ride ${ride.name} is ${ride.age}`))
        this.cohorts["0-4 months old"] = selectedRides.filter(ride => (ride.age < 5))
        this.cohorts["5-12 months old"] = selectedRides.filter(ride => (ride.age >= 5 && ride.age < 13))
        this.cohorts["13-39 months old"] = selectedRides.filter(ride => (ride.age >= 13 && ride.age < 40))
        this.cohorts["40-87 months old"] = selectedRides.filter(ride => (ride.age >= 40 && ride.age < 88))
        this.cohorts["88-103 months old"] = selectedRides.filter(ride => (ride.age >= 88 && ride.age < 104))
        this.cohorts["104-119 months old"] = selectedRides.filter(ride => (ride.age >= 104 && ride.age < 120))
        this.cohorts["120-127 months old"] = selectedRides.filter(ride => (ride.age >= 120 && ride.age < 128))
        this.cohorts["128-199 months old"] = selectedRides.filter(ride => (ride.age >= 128 && ride.age < 200))
        this.cohorts["200+ months old"] = selectedRides.filter(ride => (ride.age >= 200))
        return this.cohorts
    }
}

const GroupByRideType: Grouping<number> = {
    name: "Ride type",
    description: "Paint all rides of a type together; e.g. all selected Looping Coasters will match",
    cohorts: {
    },
    applyGrouping(selectedRides) {
        this.cohorts={};
        selectedRides.forEach(ride => {
            if (!this.cohorts[ride.type]) {this.cohorts[ride.type] = [ride]}
            else this.cohorts[ride.type].push(ride)
        })
        return this.cohorts
    }
}


export const Groupings = [
    GroupIndividually,
    GroupByRideType,
    GroupByCost,
    GroupByAge,
]
