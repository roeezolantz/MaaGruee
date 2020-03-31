const mockTree = {
    "name": "root",
    "hex": "#223F9A",
    "totalAvailableStorage": "1500000000",
    "totalUsedStorage": "950000000",
    "children": [
        {
            "name": "network2",
            "hex": "#304ffe",
            "children": [
                {
                    "name": "sensor1",
                    "hex": "#ff4081",
                    "storage": 15800,
                    "files": 100,
                    "filesQuota": 100,
                    "storageQuota": 1600,
                    "retentionDays": 30,
                },
                {
                    "name": "sensor3",
                    "hex": "#42a5f5",
                    "storage": 18000,
                    "files": 150,
                    "filesQuota": 100,
                    "storageQuota": 1600,
                    "retentionDays": 30,
                },
                {
                    "name": "sensor2",
                    "hex": "#98ee99",
                    "storage": 180000,
                    "files": 150,
                    "filesQuota": 100,
                    "storagesQuota": 1600,
                    "retentionDays": 30,
                },
                {
                    "name": "sensor4",
                    "hex": "#ff5f52",
                    "storage": 180000,
                    "files": 150,
                    "filesQuota": 100,
                    "storageQuota": 1600,
                    "retentionDays": 30,
                }
            ],
        },
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
                    "test": {
                        "value": "obj"
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
                },
                {
                    "name": "sensor2",
                    "hex": "#98ee99",
                    "storage": 180000,
                    "files": 150,
                    "filesQuota": 100,
                    "storageQuota": 1600,
                    "retentionDays": 30,
                    "randomNumber": 1000,
                }
            ],
        }
    ],
};

export default mockTree;