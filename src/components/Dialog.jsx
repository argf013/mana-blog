import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import './Dialog.css';

const ConfirmDialog = ({ message, details, onCancel, onDelete }) => {
  const [closing, setClosing] = useState(false);

  const handleCancel = () => {
    setClosing(true);
    setTimeout(onCancel, 50);
  };

  const handleDelete = () => {
    setClosing(true);
    setTimeout(onDelete, 50);
  };

  const variants = {
    open: { opacity: 1, scale: 1 },
    closed: { opacity: 0, scale: 0.8 }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      initial="closed"
      animate={closing ? "closed" : "open"}
      variants={variants}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="max-h-60 overflow-auto mb-4">
          <ul className="list-disc list-inside">
            {details.map((detail) => (
              <li className='px-2' key={detail.id}>{detail.content}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-5 py-2 bg-transparent rounded-full text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

ConfirmDialog.propTypes = {
  message: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ConfirmDialog;