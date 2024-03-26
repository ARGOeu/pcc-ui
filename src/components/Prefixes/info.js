var PrefixLabels = {
    name: {
        label: "Prefix Name",
        info: "This is the prefix name"
    },
    owner: {
        label: "Owner",
        info: "The Organization that requested the prefix"
    },
    contactName: {
        label: "Contact Name",
        info: "The name of the contact that requested the prefix"
    },
    contactEmail: {
        label: "Contact Email",
        info: "The email of the contact that requested the prefix"
    },
    usedBy: {
        label: "Used by",
        info: "The project, service, organization that is using the prefix. Information and small description of the use of prefix"
    },
    service: {
        label: "Service",
        info: "If the prefix is used by a b2 service please select it."
    },
    provider: {
        label: "Provider",
        info: "The name of the Provider that is hosting the service."
    },
    domain: {
        label: "Domain",
        info: "The branch of science, scientific discipline that is related to the use of Prefix. Here we use the classification of the Marketplace ."
    },
    contractEndDate: {
        label: "Contract End Date",
        info: "If the prefix is based on a signed contract then define the contract end date."
    },
    contractType: {
        label: "Contract Type",
        info: "Select the type of collaboration ."
    },
    lookupType: {
        label: "LookUp Type",
        info: "Define the way we can lookup the information of a PID. From the central catalogue, its own instance private, both or none"
    },
    status: {
        label: "Status",
        info: "If the prefix is mirrored by the Central Catalogue."
    },

}

var EditStats = {
    handles: {
        label: "Handles",
        info: "Handles count"
    },
    resolvable: {
        label: "Resolvable",
        info: "Resolvable count"
    },
    nonResolvable: {
        label: "Non-resolvable",
        info: "Non-resolvable count"
    },
    unchecked: {
        label: "Unchecked",
        info: "Unchecked count"
    },
}

export { PrefixLabels, EditStats };
