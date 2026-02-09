import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, X, Loader2 } from "lucide-react";
import AdminTable from "../ui/AdminTable";
import { menuAPI } from "../../services/api";

const AdminMenu = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [newItem, setNewItem] = useState({
    id: null, // Added ID field
    name: "",
    category: "Scoops",
    price: "",
    description: "",
    status: "Available", // Mapped to available boolean in submit
    imageUrl: "", // Optional for now
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
      // Auto-select image based on category if empty
      let finalImage = newItem.imageUrl;
      if (!finalImage) {
        if (newItem.category === "Scoops")
          finalImage =
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80";
        else if (newItem.category === "Sundaes")
          finalImage =
            "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=500&q=80";
        else if (newItem.category === "Shakes")
          finalImage =
            "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80";
        else
          finalImage =
            "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=500&q=80";
      }

      const payload = {
        name: newItem.name,
        category: newItem.category,
        price: parseFloat(newItem.price),
        description:
          newItem.description ||
          `Delicious ${newItem.category.toLowerCase()} made with premium ingredients.`,
        available: newItem.status === "Available",
        imageUrl: finalImage,
        isVeg: true,
      };

      if (newItem.id) {
        // Update existing
        await menuAPI.updateMenuItem(newItem.id, payload);
      } else {
        // Create new
        await menuAPI.createMenuItem(payload);
      }

      setIsFormOpen(false);
      setNewItem({
        id: null,
        name: "",
        category: "Scoops",
        price: "",
        description: "",
        status: "Available",
        imageUrl: "",
      });
      fetchMenu(); // Refresh list
    } catch (err) {
      console.error("Failed to save menu item", err);
      alert("Failed to save item. See console.");
    }
  };

  const handleEdit = (item) => {
    setNewItem({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || "",
      status: item.available ? "Available" : "Out of Stock",
      imageUrl: item.imageUrl || "",
    });
    setIsFormOpen(true);
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

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      header: "Item",
      accessor: "name",
      render: (row) => (
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleEdit(row)}
        >
          <div className="w-10 h-10 bg-stone-200 rounded-md overflow-hidden group-hover:scale-110 transition-transform">
            {row.imageUrl && (
              <img
                src={row.imageUrl}
                className="w-full h-full object-cover"
                alt={row.name}
              />
            )}
          </div>
          <span className="font-display font-bold text-[#1a1a1a] group-hover:text-[#E56E0C] transition-colors">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      render: (row) => (
        <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-bold text-stone-600 uppercase tracking-wide">
          {row.category}
        </span>
      ),
    },
    {
      header: "Price",
      accessor: "price",
      render: (row) => (
        <span className="font-body text-sm font-semibold text-stone-600">
          ₹{row.price}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "available",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${row.available ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
        >
          {row.available ? "Available" : "Out of Stock"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#1a1a1a] mb-1">
            Menu Items
          </h2>
          <p className="font-body text-xs uppercase tracking-widest text-stone-500">
            Manage flavors and products
          </p>
        </div>
        <button
          onClick={() => {
            setNewItem({
              id: null,
              name: "",
              category: "Scoops",
              price: "",
              description: "",
              status: "Available",
              imageUrl: "",
            });
            setIsFormOpen(true);
          }}
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
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#E56E0C]" />
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={filteredItems}
          onDelete={(id) => handleDelete(id)}
        />
      )}

      {/* Add/Edit Slide-over Drawer */}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsFormOpen(false)}
            ></div>

            <div className="relative transform overflow-hidden rounded-2xl bg-[#FDFBF7] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl border border-stone-200 animate-scale-in">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-white sticky top-0 z-10">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#1a1a1a]">
                    {newItem.id ? "Edit Flavor" : "Add New Flavor"}
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-body">
                    Create a new menu item
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-[#1a1a1a] hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-8 py-8 space-y-8 bg-white/50">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* --- LEFT: IMAGE SECTION --- */}
                  <div className="md:w-1/3 flex flex-col gap-4">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-dashed border-stone-300 bg-white group relative">
                      {newItem.imageUrl ? (
                        <img
                          src={newItem.imageUrl}
                          className="w-full h-full object-cover"
                          alt="Preview"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 gap-2 bg-stone-50">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">
                            Paste URL below or select preset
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newItem.imageUrl}
                        onChange={(e) =>
                          setNewItem({ ...newItem, imageUrl: e.target.value })
                        }
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-black text-[10px] font-medium placeholder:text-stone-300 transition-all shadow-sm"
                        placeholder="Image URL (Optional)..."
                      />
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500",
                          "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500",
                          "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500",
                          "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=500",
                        ].map((url, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              setNewItem({ ...newItem, imageUrl: url })
                            }
                            className="aspect-square rounded-lg border border-stone-200 overflow-hidden hover:border-[#E56E0C] hover:scale-105 transition-all"
                          >
                            <img
                              src={url}
                              className="w-full h-full object-cover"
                              alt="preset"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* --- RIGHT: FIELDS --- */}
                  <div className="flex-1 space-y-5">
                    <div className="space-y-1">
                      <label className="block font-body text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) =>
                          setNewItem({ ...newItem, name: e.target.value })
                        }
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-[#1a1a1a] focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 text-sm font-bold placeholder:text-stone-300 transition-all shadow-sm"
                        placeholder="What's this flavor called?"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block font-body text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">
                          Category
                        </label>
                        <div className="relative">
                          <select
                            value={newItem.category}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                category: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-[#1a1a1a] focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 text-sm font-medium transition-all shadow-sm appearance-none cursor-pointer hover:bg-stone-50"
                          >
                            <option>Scoops</option>
                            <option>Sundaes</option>
                            <option>Shakes</option>
                            <option>Waffles</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                            <svg
                              width="10"
                              height="6"
                              viewBox="0 0 10 6"
                              fill="currentColor"
                            >
                              <path
                                d="M1 1L5 5L9 1"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block font-body text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">
                          Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={newItem.price}
                            onChange={(e) =>
                              setNewItem({ ...newItem, price: e.target.value })
                            }
                            className="w-full bg-white border border-stone-200 rounded-xl pl-8 pr-4 py-3 text-[#1a1a1a] focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 text-sm font-bold placeholder:text-stone-300 transition-all shadow-sm"
                            placeholder="000"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-body text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">
                        Description{" "}
                        <span className="text-stone-300 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <textarea
                        value={newItem.description}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-[#1a1a1a] focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 text-sm font-medium placeholder:text-stone-300 resize-none h-20 shadow-sm"
                        placeholder="Auto-generated if left blank..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-stone-100 bg-stone-50/50 flex gap-4">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-3.5 border border-stone-200 bg-white rounded-xl text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-black hover:border-black transition-all shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3.5 bg-[#1a1a1a] rounded-xl text-xs font-bold uppercase tracking-widest text-white hover:bg-[#E56E0C] transition-all shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transform"
                >
                  {newItem.id ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
