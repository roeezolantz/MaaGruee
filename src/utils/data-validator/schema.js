export const schema = {
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "totalAvailableStorage": { "type": "number" },
        "totalUsedStorage": { "type": "number" },
        "children": {
            "type": "array",
            "allOf": [
                {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string" },
                        "children": {
                            "type": "array",
                            "allOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "name": { "type": "string" },
                                        "storage": { "type": "number" },
                                        "files": { "type": "number" },
                                        "filesQuota": { "type": "number" },
                                        "storageQuota": { "type": "number" },
                                        "retentions": { 
                                            "type": "array",
                                            
                                    }
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
}