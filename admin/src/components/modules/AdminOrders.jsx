
import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Loader2 } from 'lucide-react';
import AdminTable from '../ui/AdminTable';
import { orderAPI } from '../../services/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderAPI.getAllOrders();
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Polling
        const interval = setInterval(fetchOrders, 15000); 
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await orderAPI.updateOrderStatus(id, newStatus);
            fetchOrders();
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'COMPLETED': return 'bg-green-100 text-green-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'PROCESSING': return 'bg-blue-100 text-blue-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-stone-100 text-stone-700';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = (order.id.toString().includes(searchTerm) || (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())));
        const matchesFilter = filterStatus === 'All' || order.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const columns = [
        { header: 'Order ID', accessor: 'id', render: row => <span className="font-display font-bold text-[#1a1a1a]">#{row.id}</span> },
        { header: 'Customer', accessor: 'user', render: row => <span className="font-body text-sm font-semibold">{row.user ? row.user.name : 'Guest'}</span> },
        { 
            header: 'Items', 
            accessor: 'orderItems', 
            render: row => (
                <span className="font-body text-xs text-stone-500 truncate block max-w-[150px]" title={row.orderItems.map(i => i.menuItem.name).join(', ')}>
                    {row.orderItems.length} items
                </span>
            ) 
        },
        { 
            header: 'Date', 
            accessor: 'orderDate', 
            render: row => <span className="font-body text-xs text-stone-400 uppercase tracking-wide">{new Date(row.orderDate).toLocaleDateString()}</span> 
        },
        { header: 'Total', accessor: 'totalAmount', render: row => <span className="font-body text-sm font-bold text-[#1a1a1a]">₹{row.totalAmount}</span> },
        { 
            header: 'Status', 
            accessor: 'status', 
            render: row => (
                <div className="relative group/status cursor-pointer">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${getStatusColor(row.status)}`}>{row.status}</span>
                    {/* Quick Status Change Hover */}
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-xl rounded-lg p-2 z-20 hidden group-hover/status:flex flex-col gap-1 min-w-[100px] border border-stone-100">
                        {['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map(s => (
                            <button 
                                key={s} 
                                onClick={() => handleStatusUpdate(row.id, s)}
                                className="text-xs text-left px-2 py-1 hover:bg-stone-50 rounded uppercase font-bold text-stone-500 hover:text-black"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            ) 
        },
    ];

  return (
    <div className="space-y-8 animate-fade-in-up">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="font-display text-3xl font-bold text-[#1a1a1a] mb-1">Orders</h2>
                <p className="font-body text-xs uppercase tracking-widest text-stone-500">Track and manage customer orders</p>
            </div>
             <div className="flex bg-white rounded-full p-1 border border-stone-100 shadow-sm">
                 {['All', 'PENDING', 'PROCESSING', 'COMPLETED'].map(status => (
                    <button 
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${filterStatus === status ? 'bg-[#1a1a1a] text-white shadow-md' : 'text-stone-500 hover:text-[#1a1a1a]'}`}
                    >
                        {status}
                    </button>
                 ))}
            </div>
        </div>

        {/* Filters & Search */}
        <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by ID or Customer..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white rounded-lg border border-stone-200 focus:outline-none focus:border-[#1a1a1a] font-body text-sm shadow-sm transition-all focus:shadow-md"
                />
            </div>
        </div>

        {/* Table */}
        {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#E56E0C]" /></div>
        ) : (
            <AdminTable 
                columns={columns} 
                data={filteredOrders}
                actions={true}
                onEdit={(item) => console.log("View Order", item)}
            />
        )}

    </div>
  );
};

export default AdminOrders;
