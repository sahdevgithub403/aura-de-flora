import React, { useState, useEffect } from "react";
import { menuAPI } from "../../services/api";
import websocketService from "../../services/websocket";
import { Plus, Edit2, Trash2, Search, Loader2, X, Save } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const AdminMenu = () => {
  const { isAdmin } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  // ... (state for formData)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    available: true,
    isVeg: true,
  });

  const fetchMenuItems = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await menuAPI.getMenuItems();
      setMenuItems(response.data || []);
    } catch (err) {
      console.error("Fetch menu error:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();

    websocketService.connect();
    const unsubscribe = websocketService.subscribe("/topic/menu", () => {
      fetchMenuItems(false); // Silent refresh
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const openModal = (item = null) => {
    if (!isAdmin) {
      alert("You do not have permission to add or edit items.");
      return;
    }
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || "",
        description: item.description || "",
        price: item.price || "",
        category: item.category || "",
        imageUrl: item.imageUrl || item.image || "",
        available: item.available !== false,
        isVeg: item.isVeg !== false,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
        available: true,
        isVeg: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price greater than 0");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        price: price,
      };

      if (editingItem) await menuAPI.updateMenuItem(editingItem.id, payload);
      else await menuAPI.createMenuItem(payload);
      await fetchMenuItems();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        alert(
          "Permission Denied: You need Admin privileges to perform this action.",
        );
      } else {
        alert(
          err.response?.data?.message || err.message || "Error saving item",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = menuItems.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading && menuItems.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-slate-300" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
        {!isAdmin && (
          <div className="text-red-500 text-sm font-bold flex items-center">
            Read Only Mode
          </div>
        )}
        {isAdmin && (
          <button
            onClick={() => openModal()}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
          >
            <Plus size={18} /> Add New Item
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl || item.image}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                    />
                    <div>
                      <span className="font-medium text-slate-900 block">
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${item.isVeg ? "border-green-600 text-green-600" : "border-red-600 text-red-600"}`}
                      >
                        {item.isVeg ? "VEG" : "NON-VEG"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">
                  ₹{item.price}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.available !== false ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    {item.available !== false ? "Available" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => openModal(item)}
                    className="text-slate-400 hover:text-orange-600 p-1.5 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm("Delete this item?")) {
                        await menuAPI.deleteMenuItem(item.id);
                        fetchMenuItems();
                      }
                    }}
                    className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">
                {editingItem ? "Edit Item" : "New Item"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isVeg}
                      onChange={(e) =>
                        setFormData({ ...formData, isVeg: e.target.checked })
                      }
                      id="isVeg"
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="isVeg"
                      className="text-xs font-semibold text-slate-600 cursor-pointer"
                    >
                      Vegetarian Item
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g. Main Course"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none resize-none"
                  ></textarea>
                </div>
                <div className="col-span-2 pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) =>
                      setFormData({ ...formData, available: e.target.checked })
                    }
                    id="available"
                    className="w-4 h-4 text-orange-600"
                  />
                  <label htmlFor="available" className="text-sm text-slate-600">
                    Available for orders
                  </label>
                </div>
              </div>
              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
