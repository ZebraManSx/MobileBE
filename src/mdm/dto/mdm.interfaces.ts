export interface Say { 
    say: string;
    modifytime: Date;
};

export interface ResourceCharacteristic { 
    name: string; 
    valueType: string;
    value: string;
}; 
 
export interface ResourceSpecification {
    id: string;
    href: string;
    "@referredType": "LogicalResourceSpecification" 
}
export interface RelatedParty {
    href: string;
    id: string;
    name: string;
    role: string;
    "@referredType": "Individual";
} 

    
export interface CreateResource {
    href : string;
    id : string;
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
    "@type": "MSISDN";
    "@schemaLocation": "http://server:port/MSISDN.schema.json"; 
    "@baseType": "Resource";
}