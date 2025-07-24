import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCRM } from '../context/CRMContext';
import { format } from 'date-fns';
import ContactModal from '../components/Contacts/ContactModal';
import InteractionModal from '../components/Interactions/InteractionModal';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft, FiEdit, FiTrash2, FiPlus, FiPhone, FiMail, FiMapPin, FiBuilding, FiUser } = FiIcons;

function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useCRM();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  const contact = state.contacts.find(c => c.id === id);
  const contactInteractions = state.interactions
    .filter(i => i.contactId === id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!contact) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Contact not found</h2>
        <button
          onClick={() => navigate('/contacts')}
          className="text-primary-600 hover:text-primary-700"
        >
          Back to contacts
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      dispatch({ type: 'DELETE_CONTACT', payload: contact.id });
      navigate('/contacts');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/contacts')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
            <p className="text-gray-600">{contact.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowEditModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiEdit} />
            <span>Edit</span>
          </motion.button>
          <motion.button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiTrash2} />
            <span>Delete</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiUser} className="text-primary-700 text-3xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{contact.name}</h2>
              <p className="text-gray-600">{contact.title}</p>
            </div>

            <div className="space-y-4">
              {contact.email && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMail} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{contact.email}</p>
                  </div>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiPhone} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{contact.phone}</p>
                  </div>
                </div>
              )}
              {contact.company && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiBuilding} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="text-gray-900">{contact.company}</p>
                  </div>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMapPin} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{contact.location}</p>
                  </div>
                </div>
              )}
            </div>

            {contact.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-600 text-sm">{contact.notes}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                Added {format(new Date(contact.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Interactions</h3>
              <motion.button
                onClick={() => setShowInteractionModal(true)}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiPlus} />
                <span>Add Interaction</span>
              </motion.button>
            </div>

            {contactInteractions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No interactions recorded yet</p>
                <motion.button
                  onClick={() => setShowInteractionModal(true)}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Record First Interaction
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                {contactInteractions.map((interaction, index) => (
                  <motion.div
                    key={interaction.id}
                    className="border border-gray-200 rounded-lg p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {interaction.type}
                        </h4>
                        <p className="text-gray-600 mt-1">{interaction.notes}</p>
                        <p className="text-sm text-gray-400 mt-2">
                          {format(new Date(interaction.date), 'MMMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {showEditModal && (
        <ContactModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          contact={contact}
        />
      )}

      {showInteractionModal && (
        <InteractionModal
          isOpen={showInteractionModal}
          onClose={() => setShowInteractionModal(false)}
          contactId={contact.id}
        />
      )}
    </div>
  );
}

export default ContactDetail;