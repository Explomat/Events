export default function(places) {
	return places ||
		{
			selectedNode: {id: 2, name: "For Sale"},
			nodes: [
				{
					"id": 1,
					"name": "All Categories",
					"descr": null,
					"children": [
						{
						  "id": 2,
						  "name": "For Sale",
						  "descr": { "id":"d_1", "name":"Москва" },
						  "children": [
						    {
						      "id": 4,
						      "name": "Baby & Kids Stuff",
						      "descr": null
						    },
						    {
						      "id": 5,
						      "name": "Music, Films, Books & Games",
						      "descr": { "id":"d_4", "name":"Ярославль" }
						    }
						  ]
						},
					    {
					      "id": 6,
					      "name": "Motors",
					      "descr": { "id":"d_5", "name":"Москва" },
					      "children": [
					        {
					          "id": 7,
					          "name": "Car Parts & Accessories",
					          "descr": { "id":"d_6", "name":"Красноярск" }
					        },
					        {
					          "id": 8,
					          "name": "Cars",
					          "descr": { "id":"d_7", "name":"Москва" }
					        },
					        {
					          "id": 10016,
					          "name": "Motorbike Parts & Accessories",
					          "descr": { "id":"d_8", "name":"Москва" }
					        }
					      ]
					    },
					    {
					      "id": 9,
					      "name": "Jobs",
					      "descr": { "id":"d_9", "name":"Красноярск" },
					      "children": [
					        {
					          "id": 10,
					          "name": "Accountancy",
					          "descr": { "id":"d_10", "name":"Москва" }
					        },
					        {
					          "id": 11,
					          "name": "Financial Services & Insurance",
					          "descr": { "id":"d_11", "name":"Ставрополь" }
					        },
					        {
					          "id": 12,
					          "name": "Bar Staff & Management",
					          "descr": { "id":"d_12", "name":"Самара" }
					        }
					      ]
					    }
					]
				}
			]
		}
}