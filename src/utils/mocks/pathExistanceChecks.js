export const pathExistsMock = {
    path: ['root', 'network3', 'sensor2'],
    tree: {
        "name": "root",
        "totalAvailableStorage": "1500000000",
        "totalUsedStorage": "950000000",
        "children": [
            {
                "name": "network3",
                "hex": "#00c853",
                "children": [
                    {
                        "name": "sensor2",
                        "hex": "#98ee99",
                        "storage": 180000,
                        "files": 150,
                        "filesQuota": 100,
                        "storageQuota": 1600,
                        "retentionDays": 30,
                        "style": {
                            "fillOpacity": 1
                        },
                        "randomNumber": 1000,
                    }
                ],
                "style": {
                    "fillOpacity": 1
                }
            }
        ],
        "style": {
            "fill": "#223F9A",
            "fillOpacity": 1
        }
    }
};

export const halfPathExistsMock = {
    path: ['root', 'network3', 'sensor2'],
    tree: {
        "name": "root",
        "totalAvailableStorage": "1500000000",
        "totalUsedStorage": "950000000",
        "children": [
            {
                "name": "network3",
                "hex": "#00c853",
                "children": [
                    {
                        "name": "sensor1",
                        "hex": "#ff4081",
                        "storage": 15800,
                        "files": 100,
                        "filesQuota": 100,
                        "storageQuota": 1600,
                        "retentionDays": 30,
                        "style": {
                            "fillOpacity": 0.3
                        }
                    },
                    {
                        "name": "sensor3",
                        "hex": "#42a5f5",
                        "storage": 18000,
                        "files": 150,
                        "filesQuota": 100,
                        "storageQuota": 1600,
                        "retentionDays": 30,
                        "style": {
                            "fillOpacity": 0.3
                        }
                    },
                ],
                "style": {
                    "fillOpacity": 1
                }
            }
        ],
        "style": {
            "fill": "#223F9A",
            "fillOpacity": 1
        }
    }
};

export const pathDoesNotExistsMock = {
    path: ['roee', 'zolantz', 'check'],
    tree: {
        "name": "root",
        "totalAvailableStorage": "1500000000",
        "totalUsedStorage": "950000000",
        "children": [
            {
                "name": "network3",
                "hex": "#00c853",
                "children": [
                    {
                        "name": "sensor1",
                        "hex": "#ff4081",
                        "storage": 15800,
                        "files": 100,
                        "filesQuota": 100,
                        "storageQuota": 1600,
                        "retentionDays": 30,
                        "style": {
                            "fillOpacity": 0.3
                        }
                    },
                    {
                        "name": "sensor3",
                        "hex": "#42a5f5",
                        "storage": 18000,
                        "files": 150,
                        "filesQuota": 100,
                        "storageQuota": 1600,
                        "retentionDays": 30,
                        "style": {
                            "fillOpacity": 0.3
                        }
                    },
                ],
                "style": {
                    "fillOpacity": 1
                }
            }
        ],
        "style": {
            "fill": "#223F9A",
            "fillOpacity": 1
        }
    }
};