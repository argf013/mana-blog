import { useState } from 'react';
import useToast from '../utils/useToast';
import ConfirmDialog from '../components/Dialog';
import TableData from '../components/TableData';
import Badge from '../components/Badge';
import Card from '../components/Card';
import { LoaderProvider } from '../components/LoaderContext';
import useLoader from '../utils/useLoader';
import Breadcrumbs from '../components/BreadCrumbs';
import Button from 'argf-component'

const HomeContent = () => {
    const [showDialog, setShowDialog] = useState(false);
    const { addToast } = useToast();
    const { showLoader, hideLoader } = useLoader();

    const showToast = (message, type) => {
        addToast(message, type);
    };

    const handleCancel = () => {
        setShowDialog(false);
    };

    const handleDelete = () => {
        showToast('Items deleted successfully!', 'success');
        setShowDialog(false);
    };

    const handleEdit = (row) => {
        showToast(`Editing ${row['Product name']}`, 'info');
    };

    const handleDeleteRow = (row) => {
        showToast(`Deleting ${row['Product name']}`, 'error');
    };

    const columns = ['Product name', 'Color', 'Category', 'Price'];
    const data = [
        { 'Product name': 'Apple MacBook Pro 17"', 'Color': 'Silver', 'Category': 'Laptop', 'Price': '$2999' },
        { 'Product name': 'Microsoft Surface Pro', 'Color': 'White', 'Category': 'Laptop PC', 'Price': '$1999' },
        { 'Product name': 'Magic Mouse 2', 'Color': 'Black', 'Category': 'Accessories', 'Price': '$99' },
    ];

    const actions = [
        { label: 'Edit', onClick: handleEdit },
        { label: 'Delete', onClick: handleDeleteRow }
    ];

    const badgeStyles = {
        bgColor: 'green-100',
        textColor: 'green-800',
        darkBgColor: 'green-900',
        darkTextColor: 'green-300',
    };

    const handleShowLoader = () => {
        showLoader();
        setTimeout(() => {
            hideLoader();
        }, 2000);
    };

    const breadcrumbItems = [
        { label: 'Home', route: '/' },
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'Current Page', route: '/current' }
    ];

    return (
        <div className='px-10 py-5'>
            <Breadcrumbs items={breadcrumbItems} />
            <h1>Home</h1>
            <Button severity='danger' label='Arfa' onClick={handleShowLoader} />
            <p>Test</p>
            <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={() => showToast('This is an info toast!', 'success')}
            >
                Show Success Toast
            </button>
            <button
                className="bg-red-500 text-white p-2 rounded ml-2"
                onClick={() => showToast('This is an error toast!', 'error')}
            >
                Show Error Toast
            </button>
            <button
                className="bg-yellow-500 text-white p-2 rounded ml-2"
                onClick={() => setShowDialog(true)}
            >
                Show Confirm Dialog
            </button>
            <button
                className="bg-green-500 text-white p-2 rounded ml-2"
                onClick={handleShowLoader}
            >
                Show Loader
            </button>

            {showDialog && (
                <ConfirmDialog
                    message="Are you sure you want to delete these items?"
                    details={['Item 1', 'Item 2', 'Item 3']}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                />
            )}

            <TableData
                columns={columns}
                data={data}
                actions={actions}
                initialRowsPerPage={10}
                badgeColumn="Color"
                badgeStyles={badgeStyles}
            />

            <Badge text="Default" bgColor="blue-100" textColor="blue-800" darkBgColor="blue-900" darkTextColor="blue-300" />
            <Badge text="Dark" bgColor="gray-100" textColor="gray-800" darkBgColor="gray-700" darkTextColor="gray-300" />
            <Badge text="Red" bgColor="red-100" textColor="red-800" darkBgColor="red-900" darkTextColor="red-300" />
            <Badge text="Green" bgColor="green-100" textColor="green-800" darkBgColor="green-900" darkTextColor="green-300" />
            <Badge text="Yellow" bgColor="yellow-100" textColor="yellow-800" darkBgColor="yellow-900" darkTextColor="yellow-300" />
            <Badge text="Indigo" bgColor="indigo-100" textColor="indigo-800" darkBgColor="indigo-900" darkTextColor="indigo-300" />
            <Badge text="Purple" bgColor="purple-100" textColor="purple-800" darkBgColor="purple-900" darkTextColor="purple-300" />
            <Badge text="Pink" bgColor="pink-100" textColor="pink-800" darkBgColor="pink-900" darkTextColor="pink-300" />

            {/* Example usage of Card component */}
            <div className="mt-4">
                <Card
                    image={true}
                    imageUrl="https://via.placeholder.com/150"
                    title={true}
                    titleText="Card Title"
                    desc={true}
                    descText="This is a description for the card."
                    footer={true}
                    footerText="Footer Text"
                    rotation="portrait"
                />
                <span className='px-5'></span>
                <Card
                    image={false}
                    title={true}
                    titleText="Another Card"
                    desc={true}
                    descText="This card does not have an image."
                    footer={true}
                    footerText="Another Footer"
                    rotation="landscape"
                />
            </div>
        </div>
    );
};

const Home = () => (
    <LoaderProvider>
        <HomeContent />
    </LoaderProvider>
);

export default Home;