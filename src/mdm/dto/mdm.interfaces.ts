export interface RelatedParty {
    href: string;
    id: string;
    name: string;
    role: string;
    "@referredType": string;
} 

export interface ResourceCharacteristic { 
    name: string; 
    valueType: string;
    value: any;
}; 
 
export interface ResourceSpecification {
    id: string;
    href: string;
    "@referredType": string; 
}

export interface CreateResource {
    href : string;
    id? : string;
    activationFeature? : string;
    administrativeState? : string;
    attachment? : string;
    category? : string;
    description? : string;
    endOperatingDate? : string;
    name? : string;
    note? : string;
    operationalState? : string;
    place? : string;
    relatedParty? : RelatedParty;
    resourceCharacteristic? : ResourceCharacteristic[];
    resourceRelationship? : string;
    resourceSpecification? : ResourceSpecification;
    resourceStatus? : string;
    resourceVersion? : string;
    startOperatingDate? : string;
    usageState? : string;
    value? : string;
    "@type": string;
    "@schemaLocation": string; 
    "@baseType": string;
}