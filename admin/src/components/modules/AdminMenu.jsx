
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, X, Loader2 } from 'lucide-react';
import AdminTable from '../ui/AdminTable';
import { menuAPI } from '../../services/api';

const AdminMenu = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form State
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'Scoops',
        price: '',
        description: '',
        status: 'Available', // Mapped to available boolean in submit
        imageUrl: '' // Optional for now
    });

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const res = await menuAPI.getMenuItems();
            setMenuItems(res.data);
        } catch (err) {
            console.error("Failed to load menu", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleSubmit = async () => {
        if (!newItem.name || !newItem.price) return;
        
        try {
            // Transform to match backend entity: MenuItem
            const payload = {
                name: newItem.name,
                category: newItem.category,
                price: parseFloat(newItem.price),
                description: newItem.description,
                available: newItem.status === 'Available',
                imageUrl: newItem.imageUrl || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80', // Default image
                isVeg: true // Defaulted
            };

            await menuAPI.createMenuItem(payload);
            setIsFormOpen(false);
            setNewItem({ name: '', category: 'Scoops', price: '', description: '', status: 'Available', imageUrl: '' });
            fetchMenu(); // Refresh list
        } catch (err) {
            console.error("Failed to create menu item", err);
            alert("Failed to create item. See console.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await menuAPI.deleteMenuItem(id);
                fetchMenu();
            } catch (err) {
                console.error("Failed to delete", err);
            }
        }
    };

    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { 
            header: 'Item', 
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-200 rounded-md overflow-hidden">
                        {row.imageUrl && <img src={row.imageUrl} className="w-full h-full object-cover" alt={row.name} />}
                    </div>
                    <span className="font-display font-bold text-[#1a1a1a]">{row.name}</span>
                </div>
            )
        },
        { 
            header: 'Category', 
            accessor: 'category',
            render: (row) => (
                <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-bold text-stone-600 uppercase tracking-wide">{row.category}</span>
            )
        },
        { 
            header: 'Price', 
            accessor: 'price',
            render: (row) => <span className="font-body text-sm font-semibold text-stone-600">₹{row.price}</span>
        },
        { 
            header: 'Status', 
            accessor: 'available',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${row.available ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    {row.available ? 'Available' : 'Out of Stock'}
                </span>
            )
        },
    ];

  return (
    <div className="space-y-8 animate-fade-in-up">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="font-display text-3xl font-bold text-[#1a1a1a] mb-1">Menu Items</h2>
                <p className="font-body text-xs uppercase tracking-widest text-stone-500">Manage flavors and products</p>
            </div>
            <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-[#1a1a1a] text-white px-6 py-3 rounded-full flex items-center gap-2 text-xs uppercase tracking-widest font-bold hover:bg-[#E56E0C] transition-colors shadow-lg hover-lift w-fit"
            >
                <Plus size={16} /> Add New Item
            </button>
        </div>


        {/* Filters & Search */}
        <div className="flex gap-4 mb-4">
             {/* No changes needed here, just context for next edit */}
        </div>

        {/* Table */}
        {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#E56E0C]" /></div>
        ) : (
            <AdminTable 
                columns={columns} 
                data={filteredItems} 
                onDelete={(id) => handleDelete(id)}
            />
        )}

        {/* Add/Edit Slide-over Drawer */}
        {isFormOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsFormOpen(false)}></div>
                <div className="absolute inset-y-0 right-0 max-w-full flex">
                    <div className="w-screen max-w-md transform transition-transform bg-[#FDFBF7] shadow-2xl flex flex-col animate-slide-in-right">
                        <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-white">
                            <h2 className="font-display text-xl font-bold text-[#1a1a1a]">Add New Item</h2>
                            <button onClick={() => setIsFormOpen(false)} className="text-stone-400 hover:text-[#1a1a1a] transition-colors"><X size={24}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {/* Form Fields */}

                                <div className="space-y-4">
                                     <div className="space-y-1">
                                        <label className="block font-body text-[10px] uppercase tracking-widest text-stone-500 font-bold">Item Name</label>
                                        <input 
                                            type="text" 
                                            value={newItem.name}
                                            onChange={e => setNewItem({...newItem, name: e.target.value})}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] text-sm font-medium placeholder:text-stone-300 transition-colors" 
                                            placeholder="e.g. Belgian Chocolate" 
                                        />
                                     </div>
                                

                                <div className="space-y-1">
                                    <label className="block font-body text-[10px] uppercase tracking-widest text-stone-500 font-bold">Category</label>
                                    <select 
                                        value={newItem.category}
                                        onChange={e => setNewItem({...newItem, category: e.target.value})}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] text-sm font-medium transition-colors"
                                    >
                                        <option>Scoops</option>
                                        <option>Sundaes</option>
                                        <option>Shakes</option>
                                        <option>Waffles</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="block font-body text-[10px] uppercase tracking-widest text-stone-500 font-bold">Price (₹)</label>
                                        <input 
                                            type="number" 
                                            value={newItem.price}
                                            onChange={e => setNewItem({...newItem, price: e.target.value})}
                                            className="w-full bg-transparent border-b border-stone-300 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] text-sm font-medium placeholder:text-stone-300" 
                                            placeholder="0.00" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block font-body text-[10px] uppercase tracking-widest text-stone-500 font-bold">Stock Status</label>
                                        <select 
                                            value={newItem.status}
                                            onChange={e => setNewItem({...newItem, status: e.target.value})}
                                            className="w-full bg-transparent border-b border-stone-300 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] text-sm font-medium"
                                        >
                                            <option>Available</option>
                                            <option>Out of Stock</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="block font-body text-[10px] uppercase tracking-widest text-stone-500 font-bold">Description</label>
                                    <textarea 
                                        value={newItem.description}
                                        onChange={e => setNewItem({...newItem, description: e.target.value})}
                                        className="w-full bg-transparent border-b border-stone-300 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] text-sm font-medium placeholder:text-stone-300 resize-none h-24" 
                                        placeholder="Item description..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-stone-200 bg-white flex gap-4">
                            <button onClick={() => setIsFormOpen(false)} className="flex-1 py-3 border border-stone-200 rounded-lg text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors">Cancel</button>
                            <button onClick={handleSubmit} className="flex-1 py-3 bg-[#1a1a1a] rounded-lg text-xs font-bold uppercase tracking-widest text-white hover:bg-[#E56E0C] transition-colors shadow-lg">Save Item</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default AdminMenu;
