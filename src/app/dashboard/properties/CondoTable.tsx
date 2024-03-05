import React, {useEffect} from 'react';

function CondoTable() {

    useEffect(() => {
        // Fetch condo data

    }, []);

    return (
        <div>
            <table className={""}>
                <thead>
                    <tr>
                        <th>Condo Name</th>
                        <th>Condo Address</th>
                        <th>Condo Number</th>
                        <th>Parking Count</th>
                        <th>Locker Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default CondoTable;