import React, {useEffect} from 'react';
import PopupPanel from "@/app/components/dashboard/PopupPanel";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import {
    allocateParkingLockerById,
    createParkingLocker,
    deleteParkingLocker,
    freeParkingLockerById,
    getHighestParkingLockerId,
    updateParkingLockerFee
} from "@/app/api/property/ParkingLockerAPI";

interface ParkingLockerViewProps {
    type: 'PARKING' | 'LOCKER';
    view: 'PUBLIC' | 'COMPANY';
    from: 'PROPERTY' | 'CONDO';
    selectedItem: any;
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
    items: any[];
}

function ParkingLockerView(props: ParkingLockerViewProps) {
    const {
        isVisible, setIsVisible,
        type,
        view,
        from,
        items,
        selectedItem
    } = props;

    const [filteredItems, setFilteredItems] = React.useState<any[]>([]);
    const filteredItemsRef = React.useRef(filteredItems);
    const [popupTile, setPopupTitle] = React.useState<string>('');
    const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
    const [itemsToAdd, setItemsToAdd] = React.useState<{[key: number]: number}>({});
    const [itemsToEdit, setItemsToEdit] = React.useState<{[key: number]: number}>({});
    const itemsToDeleteRef = React.useRef(selectedItems);

    const tableHeaders = [
        {name: type == 'PARKING' ? 'Parking ID' : 'Locker ID', key: 'id_col'},
        {name: type == 'PARKING' ? 'Parking Fee' : 'Locker Fee', key: 'fee_col'},
        {name: "Status", key: "status"},
    ]

    useEffect(() => {
        filteredItemsRef.current = filteredItems;
    }, [filteredItems]);

    useEffect(() => {
        itemsToDeleteRef.current = selectedItems;
    }, [selectedItems]);


    const saveChangesFromProperty = async () => {
        for (let i = 0; i < Object.keys(itemsToAdd).length; i++) {
            await createParkingLocker(selectedItem.id, type)
        }
        for (let i = 0; i < Object.keys(itemsToEdit).length; i++) {
            await updateParkingLockerFee(parseInt(Object.keys(itemsToEdit)[i]), itemsToEdit[parseInt(Object.keys(itemsToEdit)[i])], type)
        }
        window.location.reload()
    }

    const saveChangesFromUnit = async () => {
        let previouslySelectedItems = items.reduce((acc, item) => {
            if (item.unit_id == selectedItem.id) {
                acc.push(item.id)
            }
            return acc
        }, [])
        // An item is freed if it was previously selected but not selected now
        let itemsToFree = previouslySelectedItems.filter((item: number) => !itemsToDeleteRef.current.includes(item))
        // An item is allocated if it was not previously selected but selected now
        let itemsToAllocate = itemsToDeleteRef.current.filter((item: number) => !previouslySelectedItems.includes(item))
        console.log("Items to allocate: ", itemsToAllocate)
        for (let i = 0; i < itemsToAllocate.length; i++) {
            await allocateParkingLockerById(itemsToAllocate[i], selectedItem.id, type)
        }
        for (let i = 0; i < itemsToFree.length; i++) {
            await freeParkingLockerById(itemsToFree[i], type)
        }
        window.location.reload()
    }
    const toggleItemToDelete = (id: number) => {
        setSelectedItems(prevItemsToDelete => {
            if (prevItemsToDelete.includes(id)) {
                // If the item is already selected, remove it from the list
                return prevItemsToDelete.filter(item_id => item_id !== id);
            } else {
                // If the item is not already selected, add it to the list
                return [...prevItemsToDelete, id];
            }
        });
    };

    const addItem = async () => {
        // Cannot add more items than the max count
        if (items.length + Object.keys(itemsToAdd).length >= (type == 'PARKING' ? selectedItem.parking_count : selectedItem.locker_count)) {
            return;
        }
        let newId = -1;
        // If itemsToAdd is empty, get the highest id from the database
        if (Object.keys(itemsToAdd).length == 0) {
            const {data, error} = await getHighestParkingLockerId(type)
            if(data) newId = data[0].id + 1;
        } else {
            let keys = Object.keys(itemsToAdd).map((key) => parseInt(key));
            newId = Math.max(...keys) + 1;
        }
        if(newId != -1) setItemsToAdd(currentItemsToAdd => ({ ...currentItemsToAdd, [newId]: 0 }));
    }

    const deleteItems = async () => {
        for (let i = 0; i < selectedItems.length; i++) {
            await deleteParkingLocker(selectedItems[i], type)
        }
        window.location.reload()
    }

    const selectInitialItems = () => {
        let itemsToSelect = items.reduce((acc, item) => {
            if (item.unit_id == selectedItem.id) {
                acc.push(item.id)
            }
            return acc
        }, [])
        setSelectedItems(itemsToSelect)
    }

    // On popup close, reset.
    useEffect(() => {
        if (!isVisible) {
            setSelectedItems([])
            setItemsToAdd({})
            setItemsToEdit({})
            setFilteredItems([])
        }
    }, [isVisible]);

    useEffect(() => {
        if(view == 'COMPANY' && from == 'CONDO') selectInitialItems()
    }, [items]);

    const isItemOccupiedByUnit = (id: number) => {
        // The checkbox should be disabled if the item is already allocated to another unit
        if(view == 'COMPANY' && from == 'CONDO') {
            let item = items.find(item => item.id == id)
            return item.unit_id && item.unit_id != selectedItem.id;
        }
        else return false
    }

    const updateFilteredItems = (list: any[]) => {
        // concat list and itemsToAdd
        list = list.concat(Object.keys(itemsToAdd).map((id) => {
            return {id: parseInt(id), fee: itemsToAdd[parseInt(id)], type: 'NEW'}
        }))
        let filteredData = list.map((item) => {
            return {
                id: item.id,
                id_col: view == 'COMPANY' ?
                    <div className={`flex flex-row justify-between px-2`}>
                        <input type="checkbox"
                               onChange={() => toggleItemToDelete(item.id)}
                               checked={selectedItems.includes(item.id)}
                               disabled={isItemOccupiedByUnit(item.id) || item.type == 'NEW'}
                        />
                        <div>{item.id}</div>
                        <input
                            className={"invisible"}
                            type="checkbox"
                        />
                    </div> : item.id,
                fee: item.fee,
                fee_col: from == "PROPERTY" ?
                    <input
                        className="px-2 py-1 my-1 mx-2 max-w-28 min-w-28 appearance-none border border-slate-300 focus:outline-slate-500 rounded-md text-center"
                        key={`fee-${item.id}`}
                        defaultValue={itemsToEdit[item.id] || item.fee}
                        onBlur={(e) => {
                            const newFee = parseFloat(e.target.value);
                            setItemsToEdit(currentFees => ({ ...currentFees, [item.id]: newFee }));
                        }}
                        type="number" id="fee">
                    </input> : item.fee.toString(),
                status: item.unit_id ? 'Occupied' : 'Available'
            }
        })
        filteredData.sort((a, b) => a.id - b.id)
        setFilteredItems(filteredData)
    }

    useEffect(() => {
        updateFilteredItems(items)
        setPopupTitle(type == 'PARKING' ? 'Parking Spots: ' + selectedItem.name : 'Lockers: ' + selectedItem.name)
    }, [items, selectedItems, itemsToEdit, itemsToAdd]);

    const TableContainer = () => (
        <div
            className={"max-h-96 overflow-y-auto shadow-sm"}>
            <DashboardTable
                headers={tableHeaders}
                items={filteredItems}
            />
        </div>
    );

    const TableEditorFromUnit = () => (
        <div>
            <div className={"p-1 flex justify-between"}>
                <span className={"text-md font-medium text-slate-700"}>
                    All {type == 'PARKING' ? 'Parking Spots' : 'Lockers'} from Property: {selectedItem.property?.name}
                </span>
            </div>
            <TableContainer/>
        </div>
    )
    const TableEditorFromProperty = () => (
        <div className={""}>
            <div className={"p-1 flex justify-between"}>
                <span className={"text-md font-medium text-slate-700"}>
                    Max {type == 'PARKING' ? 'Parking' : 'Locker'} Count: {type == "PARKING" ? selectedItem.parking_count : selectedItem.locker_count}</span>
                <span>
                    Current Count: {items.length + Object.keys(itemsToAdd).length}
                </span>
            </div>
            <TableContainer/>
            <div className={"mt-3 flex flex-row justify-between"}>
                <button
                    onClick={addItem}
                    className={"py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white text-sm rounded-md"}>
                    Add {type == 'PARKING' ? 'Parking' : 'Locker'}
                </button>
                <button
                    onClick={deleteItems}
                    className={`py-1 px-3  text-white text-sm rounded-md ${selectedItems.length == 0 ? 'bg-gray-500 ' : 'bg-red-500 hover:bg-red-700'}`}
                    disabled={selectedItems.length == 0}
                >
                    Delete Selected
                </button>
            </div>
        </div>
    );

    return (
        <>
            {view == 'PUBLIC' && from == 'CONDO' && (
                <PopupPanel
                    title={popupTile}
                    visible={isVisible}
                    setVisible={setIsVisible}
                    children={<TableContainer/>}
                />)
            }
            {view == 'COMPANY' && from == 'CONDO' && (
                <PopupPanel
                    title={popupTile}
                    visible={isVisible}
                    setVisible={setIsVisible}
                    children={<TableEditorFromUnit/>}
                    buttonTitle={"Allocate " + (type == 'PARKING' ? 'Parking Spot' : 'Locker') + ' to Unit'}
                    onClick={saveChangesFromUnit}
                />)
            }
            {view == 'COMPANY' && from == 'PROPERTY' && (
                <PopupPanel
                    title={popupTile}
                    visible={isVisible}
                    setVisible={setIsVisible}
                    children={<TableEditorFromProperty/>}
                    buttonTitle={"Save Changes"}
                    onClick={saveChangesFromProperty}
                />)
            }
        </>
    );
}

export default ParkingLockerView;