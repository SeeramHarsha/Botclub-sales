import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Settings,
  Plus,
  Trash2,
  FileText,
  Printer,
  DollarSign,
  Users,
  Package,
  ArrowLeft,
  Briefcase,
  Lock,
  AlertCircle,
  Check,
  History,
  Save,
  Clock,
  Eye,
  Menu,
  X,
  Image as ImageIcon,
  Landmark,
  GripVertical
} from 'lucide-react';
import html2canvas from 'html2canvas';

// --- Default Data for BotClub ---
const INITIAL_CATALOG = [
  { id: 1, name: 'Physical models (x32 models)', category: 'Hardware', price: 5450.00, description: 'Comprehensive set of 32 physical learning models for hands-on activities.', paymentType: 'Subscription' },
  { id: 2, name: 'Classroom presentation application', category: 'Software', price: 3000.00, description: 'Interactive software for classroom smart boards. (Monthly License)', paymentType: 'Subscription' },
  { id: 3, name: 'Teacher pro dashboard', category: 'Software', price: 1500.00, description: 'Advanced analytics and class management tools for teachers. (Monthly License)', paymentType: 'Subscription' },
  { id: 4, name: 'Principal pro dashboard', category: 'Software', price: 500.00, description: 'High-level oversight and reporting module for school administration. (Monthly License)', paymentType: 'Subscription' },
  { id: 5, name: 'TV', category: 'Add-ons', price: 834.00, description: 'Display unit for classroom content.', paymentType: 'Subscription' },
  { id: 6, name: 'Module for TV screens', category: 'Add-ons', price: 625.00, description: 'Hardware interface module to connect TV with learning system.', paymentType: 'Subscription' },
  { id: 7, name: 'Tablet (with pre-installed software)', category: 'Add-ons', price: 625.00, description: 'Student tablet device pre-loaded with educational apps.', paymentType: 'Subscription' },
  { id: 8, name: 'Storage racks', category: 'Add-ons', price: 625.00, description: 'Durable racks for organizing physical models and kits.', paymentType: 'Subscription' },
];

// --- Dependency Rules ---
const DEPENDENCIES = {
  3: { requiredId: 2, name: 'Classroom presentation application' },
  6: { requiredId: 2, name: 'Classroom presentation application' },
  7: { requiredId: 2, name: 'Classroom presentation application' },
  8: { requiredId: 1, name: 'Physical models (x32 models)' },
};

const INITIAL_COMPANY_INFO = {
  name: "BotClub Private Limited",
  address: "Wing-3, APIS, ITSEZ, Hill no-3, Rushikonda, Visakhapatnam, A.P - 530045",
  email: "contact@botclub.in",
  phone: "+91 8919292103",
  gstin: "37AAGCB8306B1ZZ"
};

const INITIAL_SUBSCRIPTION_TERMS = "Notice: The pricing for products listed in this quotation reflects monthly subscription costs. By accepting this quote, the client agrees to a minimum 24-month renewal commitment for all subscription-based services.";
const INITIAL_DEFAULT_NOTES = "Quote valid for 30 days. Payment terms: 50% advance, 50% on delivery.";
const INITIAL_DOC_TITLE = "Proforma Invoice";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", icon: Icon, disabled = false }) => {
  const baseStyle = "flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

const Toast = ({ message, onClose, type = 'error' }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    error: 'bg-red-600',
    success: 'bg-emerald-600'
  };

  return (
    <div className={`fixed bottom-6 right-6 ${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50 print:hidden`}>
      {type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [catalog, setCatalog] = useState(() => {
    const saved = localStorage.getItem('botclub_catalog');
    return saved ? JSON.parse(saved) : INITIAL_CATALOG;
  });
  // Persistent Company Info
  const [companyInfo, setCompanyInfo] = useState(() => {
    const saved = localStorage.getItem('botclub_company_info');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_INFO;
  });

  // Persistent Terms Configuration
  const [subscriptionTerms, setSubscriptionTerms] = useState(() => {
    const saved = localStorage.getItem('botclub_subscription_terms');
    return saved || INITIAL_SUBSCRIPTION_TERMS;
  });

  const [defaultNotes, setDefaultNotes] = useState(() => {
    const saved = localStorage.getItem('botclub_default_notes');
    return saved || INITIAL_DEFAULT_NOTES;
  });

  const [docTitle, setDocTitle] = useState(() => {
    const saved = localStorage.getItem('botclub_doc_title');
    return saved || INITIAL_DOC_TITLE;
  });

  const [toast, setToast] = useState(null);
  const [savedQuotes, setSavedQuotes] = useState([]);

  useEffect(() => {
    localStorage.setItem('botclub_catalog', JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem('botclub_company_info', JSON.stringify(companyInfo));
  }, [companyInfo]);

  useEffect(() => {
    localStorage.setItem('botclub_subscription_terms', subscriptionTerms);
  }, [subscriptionTerms]);

  useEffect(() => {
    localStorage.setItem('botclub_default_notes', defaultNotes);
  }, [defaultNotes]);

  useEffect(() => {
    localStorage.setItem('botclub_doc_title', docTitle);
  }, [docTitle]);

  // Current Quote State
  const [customerName, setCustomerName] = useState('Sri Chaitanya School');
  const [customerContact, setCustomerContact] = useState('Mr. Srinivas (Admin)');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState('admin@srichaitanya.edu');
  const [customerAddress, setCustomerAddress] = useState('Visakhapatnam, Andhra Pradesh');
  const [quoteItems, setQuoteItems] = useState([]);
  const [hardwareDiscount, setHardwareDiscount] = useState(0);
  const [subscriptionDiscount, setSubscriptionDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(18);
  const [notes, setNotes] = useState(defaultNotes);
  const [sectionOrder, setSectionOrder] = useState(['hardware', 'subscription']);

  // Update notes when defaultNotes changes (e.g. from Settings)
  useEffect(() => {
    setNotes(defaultNotes);
  }, [defaultNotes]);

  // Settings State (Hoisted)
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Hardware', description: '', paymentType: 'Subscription' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load quotes from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('botclub_saved_quotes');
    if (saved) {
      setSavedQuotes(JSON.parse(saved));
    }
  }, []);

  // Persist quotes to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('botclub_saved_quotes', JSON.stringify(savedQuotes));
  }, [savedQuotes]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if ((num = Math.round(num).toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';

    let str = '';
    str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';

    return str.trim();
  };

  const isLocked = (productId) => {
    const rule = DEPENDENCIES[productId];
    if (!rule) return false;
    return !quoteItems.some(item => item.id === rule.requiredId);
  };

  const addToQuote = (product) => {
    if (isLocked(product.id)) {
      const rule = DEPENDENCIES[product.id];
      setToast({ message: `Cannot add yet! Requires "${rule.name}" to be added first.`, type: 'error' });
      return;
    }

    const existingItemIndex = quoteItems.findIndex(item => item.id === product.id);
    if (existingItemIndex > -1) {
      const newItems = [...quoteItems];
      newItems[existingItemIndex].quantity += 1;
      setQuoteItems(newItems);
    } else {
      const newItem = {
        ...product,
        uid: Date.now(),
        quantity: 1,
        discount: 0
      };
      setQuoteItems([...quoteItems, newItem]);
    }
  };

  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (index) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newItems = [...quoteItems];
    const draggedItem = newItems[draggedItemIndex];
    newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setQuoteItems(newItems);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const updateItem = (uid, field, value) => {
    setQuoteItems(items => items.map(item =>
      item.uid === uid ? { ...item, [field]: parseFloat(value) || 0 } : item
    ));
  };

  const removeItem = (uid) => {
    setQuoteItems(items => items.filter(item => item.uid !== uid));
  };

  const calculateTotals = (items = quoteItems, discountPercentage = 0, tax = taxRate) => {
    const subtotal = items.reduce((acc, item) => {
      const itemTotal = item.price * item.quantity;
      const itemDiscounted = Math.round(itemTotal * (1 - (item.discount / 100))); // Item level discount
      return acc + itemDiscounted;
    }, 0);

    const discountAmount = Math.round(subtotal * (discountPercentage / 100));
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = Math.round(taxableAmount * (tax / 100));
    const total = taxableAmount + taxAmount;

    return { subtotal, discountAmount, taxableAmount, taxAmount, total };
  };

  const oneTimeIds = quoteItems.filter(i => (i.paymentType || 'Subscription') === 'One-time Payment');
  const subIds = quoteItems.filter(i => (i.paymentType || 'Subscription') === 'Subscription');

  const oneTimeTotals = calculateTotals(oneTimeIds, hardwareDiscount);
  const subTotals = calculateTotals(subIds, subscriptionDiscount);

  const totals = {
    subtotal: oneTimeTotals.subtotal + subTotals.subtotal,
    discountAmount: oneTimeTotals.discountAmount + subTotals.discountAmount,
    taxableAmount: oneTimeTotals.taxableAmount + subTotals.taxableAmount,
    taxAmount: oneTimeTotals.taxAmount + subTotals.taxAmount,
    total: oneTimeTotals.total + subTotals.total
  };

  const handleSaveQuote = () => {
    if (quoteItems.length === 0) {
      setToast({ message: "Cannot save an empty quote.", type: 'error' });
      return;
    }

    const newQuote = {
      id: Date.now(),
      date: new Date().toISOString(),
      customerName,
      customerContact,
      customerPhone,
      customerEmail,
      items: quoteItems,
      hardwareDiscount,
      subscriptionDiscount,
      taxRate,
      notes,
      totals
    };

    setSavedQuotes([newQuote, ...savedQuotes]);
    setToast({ message: "Quote saved successfully!", type: 'success' });
  };

  const handleDeleteQuote = (id) => {
    const updatedQuotes = savedQuotes.filter(q => q.id !== id);
    setSavedQuotes(updatedQuotes);
    setToast({ message: "Quote deleted.", type: 'success' });
  };

  const handleLoadQuote = (quote) => {
    setCustomerName(quote.customerName);
    setCustomerContact(quote.customerContact);
    setCustomerPhone(quote.customerPhone);
    setCustomerEmail(quote.customerEmail);
    setQuoteItems(quote.items);
    setHardwareDiscount(quote.hardwareDiscount || 0);
    setSubscriptionDiscount(quote.subscriptionDiscount || 0);
    setTaxRate(quote.taxRate);
    setNotes(quote.notes);
    setActiveTab('preview');
    setToast({ message: "Quote loaded from history.", type: 'success' });
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById('quote-preview-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `BotClub_Quote_${customerName.replace(/\s+/g, '_')}_${Date.now()}.png`;
      link.click();
      setToast({ message: "Quote saved as image!", type: 'success' });
    } catch (error) {
      console.error("Image generation failed", error);
      setToast({ message: "Failed to save image.", type: 'error' });
    }
  };

  // --- VIEWS ---

  const renderSidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col h-full flex-shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <span>BotClub</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Sales Configurator</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Calculator className="w-5 h-5" />
            <span>Quote Builder</span>
          </button>

          <button
            onClick={() => { setActiveTab('preview'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <FileText className="w-5 h-5" />
            <span>Preview Quote</span>
          </button>

          <button
            onClick={() => { setActiveTab('history'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <History className="w-5 h-5" />
            <span>Quotations</span>
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Admin</p>
            <button
              onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
            >
              <Settings className="w-5 h-5" />
              <span>Catalog Config</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );

  const renderQuoteBuilder = () => (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-1 flex flex-col gap-6 min-w-0 w-full">

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Client Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">School Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Contact Person</label>
              <input
                type="text"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Phone Number</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Email ID</label>
              <input
                type="text"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-2">Address</label>
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Available Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {catalog.map(product => {
              const locked = isLocked(product.id);
              const selectedQty = quoteItems.filter(item => item.id === product.id).reduce((acc, curr) => acc + curr.quantity, 0);
              const isSelected = selectedQty > 0;

              return (
                <button
                  key={product.id}
                  onClick={() => addToQuote(product)}
                  className={`flex flex-col items-start p-3 rounded-lg border transition-all text-left group h-full relative overflow-hidden
                    ${locked
                      ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                      : isSelected
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50 bg-white'
                    }`}
                >
                  {/* Status Badge Top Right */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {locked && <Lock className="w-4 h-4 text-slate-400" />}
                    {isSelected && (
                      <div className="flex items-center gap-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
                        <span>{selectedQty}</span>
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className={`font-medium ${locked ? 'text-slate-500' : 'text-slate-800 group-hover:text-blue-700'}`}>
                    {product.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[2.5em]">{product.description}</div>
                  <div className="text-sm text-slate-500 flex justify-between w-full mt-2 pt-2 border-t border-slate-100">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{product.category}</span>
                    <span className="font-bold text-slate-700">{formatMoney(product.price)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 flex-1">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Line Items
          </h2>
          {quoteItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p>No items added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
                <div className="col-span-4">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Disc %</div>
                <div className="col-span-2"></div>
              </div>

              {quoteItems.map((item, index) => (
                <div
                  key={item.uid}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`grid grid-cols-12 gap-4 items-center bg-slate-50 p-2 rounded-lg border border-slate-100 transition-all ${draggedItemIndex === index ? 'opacity-50 ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                >
                  <div className="col-span-4 flex items-center gap-2">
                    <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-600">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-slate-800 truncate">{item.name}</div>
                      <div className="text-xs text-slate-500 truncate">{item.description}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.uid, 'quantity', e.target.value)}
                      className="w-full text-center border border-slate-300 rounded px-2 py-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2 text-right text-sm font-medium text-slate-700">
                    {formatMoney(item.price)}
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discount}
                      onChange={(e) => updateItem(item.uid, 'discount', e.target.value)}
                      className="w-full text-right border border-slate-300 rounded px-2 py-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <button onClick={() => removeItem(item.uid)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded" title="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="lg:sticky lg:top-6 space-y-4">
          <Card className="p-6 bg-slate-900 text-white border-slate-800">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Quote Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{formatMoney(totals.subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>Hardware Discount</span>
                <div className="flex items-center w-20">
                  <input
                    type="number"
                    value={hardwareDiscount}
                    onChange={(e) => setHardwareDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded text-right px-2 py-1 text-white focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="ml-1">%</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Subscription Discount</span>
                <div className="flex items-center w-20">
                  <input
                    type="number"
                    value={subscriptionDiscount}
                    onChange={(e) => setSubscriptionDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded text-right px-2 py-1 text-white focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="ml-1">%</span>
                </div>
              </div>

              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount Applied</span>
                  <span>-{formatMoney(totals.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400 font-medium">
                <span>Taxable Amount</span>
                <span>{formatMoney(totals.taxableAmount)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400 pt-2 border-t border-slate-800">
                <span>GST Rate (%)</span>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-16 bg-slate-800 border border-slate-700 rounded text-right px-2 py-1 text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between text-slate-400">
                <span>GST Amount</span>
                <span>{formatMoney(totals.taxAmount)}</span>
              </div>

              <div className="flex justify-between text-xl font-bold pt-4 border-t border-slate-700 mt-2">
                <span>Total</span>
                <span>{formatMoney(totals.total)}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button onClick={handleSaveQuote} variant="secondary" className="w-full" icon={Save}>
                Save Quote
              </Button>
              <Button variant="success" className="w-full" icon={FileText} onClick={() => setActiveTab('preview')}>
                Preview Quote
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPrintPreview = () => (
    <div className="max-w-4xl mx-auto h-full flex flex-col print:block print:h-auto print:w-full print:max-w-none">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button variant="secondary" icon={ArrowLeft} onClick={() => setActiveTab('dashboard')}>
          Back to Editor
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" icon={Save} onClick={handleSaveQuote}>
            Save to History
          </Button>
          <Button variant="secondary" icon={ImageIcon} onClick={handleDownloadImage}>
            Save as Image
          </Button>
          <Button variant="primary" icon={Printer} onClick={() => window.print()}>
            Print / Save PDF
          </Button>
        </div>
      </div>

      <div id="quote-preview-content" className="bg-white shadow-lg p-8 min-h-[1000px] print:shadow-none print:p-0">
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-4 mb-4">
          <div>
            <div className="text-3xl font-bold text-blue-800">BotClub</div>
            <p className="text-slate-500 text-sm mt-1">Teaching & Learning Solutions</p>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wider mb-2">{docTitle}</h1>
            <div className="text-sm text-slate-600 max-w-[300px] ml-auto">
              <div className="font-bold text-lg text-slate-800 mb-1">{companyInfo.name}</div>
              <div className="whitespace-pre-wrap">{companyInfo.address}</div>
              <div className="mt-2">
                <div>{companyInfo.email}</div>
                <div>{companyInfo.phone}</div>
                <div className="font-medium text-slate-800 mt-1">GSTIN: {companyInfo.gstin}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div className="w-1/2">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Quote For</h3>
            <div className="text-slate-800 font-semibold text-lg">{customerName}</div>
            <div className="text-slate-600 whitespace-pre-wrap mb-1">{customerAddress}</div>
            <div className="text-slate-600 mb-1">{customerContact}</div>
            {customerEmail && <div className="text-slate-500 text-sm">{customerEmail}</div>}
            {customerPhone && <div className="text-slate-500 text-sm">{customerPhone}</div>}
          </div>
          <div className="w-1/2 text-right">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Quote Details</h3>
            <div className="flex justify-end gap-8">
              <div>
                <span className="block text-xs text-slate-500">Date</span>
                <span className="font-medium">{new Date().toLocaleDateString('en-IN')}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500">Valid Until</span>
                <span className="font-medium">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {(() => {
          const oneTimeItems = quoteItems.filter(i => (i.paymentType || 'Subscription') === 'One-time Payment');
          const subscriptionItems = quoteItems.filter(i => (i.paymentType || 'Subscription') === 'Subscription');

          const oneTimeTotals = calculateTotals(oneTimeItems, hardwareDiscount);
          const subTotals = calculateTotals(subscriptionItems, subscriptionDiscount);

          const renderSection = (title, items, sectionTotals, isSubscription, appliedDiscount) => (
            <div className="mb-6">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-2">{title}</h3>
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-1 font-bold text-slate-600 w-1/2 text-xs">Description</th>
                    <th className="text-center py-1 font-bold text-slate-600 text-xs">Qty</th>
                    <th className="text-right py-1 font-bold text-slate-600 text-xs">Unit Price</th>
                    <th className="text-right py-1 font-bold text-slate-600 text-xs">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {items.map((item) => (
                    <tr key={item.uid} className="border-b border-slate-50">
                      <td className="py-2 text-slate-700">
                        <div className="font-medium text-sm">{item.name}</div>
                        {item.description && <div className="text-xs text-slate-500">{item.description}</div>}
                        <div className="text-[10px] text-slate-400 mt-0.5 inline-block bg-slate-50 px-1 rounded">{item.category}</div>
                      </td>
                      <td className="py-2 text-center text-slate-700 align-top pt-2">{item.quantity}</td>
                      <td className="py-2 text-right text-slate-700 align-top pt-2">
                        {item.discount > 0 ? (
                          <div>
                            <span className="line-through text-slate-400 text-xs mr-2">{formatMoney(item.price)}</span>
                            <span>{formatMoney(item.price * (1 - item.discount / 100))}</span>
                          </div>
                        ) : (
                          formatMoney(item.price)
                        )}
                      </td>
                      <td className="py-2 text-right font-medium text-slate-800 align-top pt-2">
                        {formatMoney(item.quantity * item.price * (1 - item.discount / 100))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col items-end gap-1 text-sm text-slate-600">
                <div className="flex justify-between w-64">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatMoney(sectionTotals.subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between w-64 text-green-600">
                    <span>Discount ({appliedDiscount}%):</span>
                    <span>-{formatMoney(sectionTotals.discountAmount)}</span>
                  </div>
                )}

                <div className="w-64 border-t border-slate-300 my-1"></div>

                <div className="flex justify-between w-64 text-base font-bold text-slate-800">
                  <span>Taxable Amount:</span>
                  <span>{formatMoney(sectionTotals.taxableAmount)}</span>
                </div>

                {docTitle !== 'Proforma Invoice' && (
                  <>
                    <div className="flex justify-between w-64">
                      <span>GST ({taxRate}%):</span>
                      <span className="font-medium">{formatMoney(sectionTotals.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between w-64 text-lg font-bold text-slate-900 border-t-2 border-slate-800 pt-2 mt-1">
                      <span>Total {isSubscription ? '(Monthly)' : '(One-time)'}:</span>
                      <span>{formatMoney(sectionTotals.total)}</span>
                    </div>
                  </>
                )}

                <div className="w-64 text-right text-xs text-slate-700 mt-1 font-bold">
                  Rupees {numberToWords(docTitle === 'Proforma Invoice' ? sectionTotals.taxableAmount : sectionTotals.total)} Only
                </div>
                {isSubscription && (
                  <div className="w-64 text-right text-xs text-slate-500">
                    * Includes monthly subscription items
                  </div>
                )}
              </div>
            </div>
          );

          return (
            <>
              {sectionOrder.map(section => {
                if (section === 'hardware' && oneTimeItems.length > 0) {
                  return renderSection("Hardware Only - One time Charges", oneTimeItems, oneTimeTotals, false, hardwareDiscount);
                }
                if (section === 'subscription' && subscriptionItems.length > 0) {
                  return renderSection("Subscription - Monthly ( Hardware + Software)", subscriptionItems, subTotals, true, subscriptionDiscount);
                }
                return null;
              })}

              {docTitle === 'Proforma Invoice' && (
                <div className="mt-4 text-left">
                  <p className="text-red-600 font-bold text-xs">
                    * GST @18% will be applicable as per government norms and added in the final invoice
                  </p>
                </div>
              )}
            </>
          );
        })()}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-600" />
              Bank Details
            </h4>
            <div className="text-sm space-y-2">
              <div className="font-bold text-slate-800 tracking-wide text-sm border-b border-slate-200 pb-1">BOTCLUB PRIVATE LIMITED</div>
              <div className="grid grid-cols-[70px_1fr] gap-y-1 gap-x-4 text-slate-600">
                <span className="font-medium text-slate-500">Bank</span>
                <span className="font-medium text-slate-900">IDFC FIRST</span>

                <span className="font-medium text-slate-500">A/C No</span>
                <span className="font-mono font-bold text-slate-900 tracking-wide">10173843631</span>

                <span className="font-medium text-slate-500">IFSC</span>
                <span className="font-mono font-medium text-slate-900">IDFB0080412</span>

                <span className="font-medium text-slate-500">Branch</span>
                <span className="text-slate-900">Visakhapatnam - Daba Garden Branch</span>
              </div>
            </div>
          </div>
          <div>
            {/* Spacer for right side */}
          </div>
        </div>

        {quoteItems.some(item => item.paymentType === 'Subscription') && (
          <div className="mt-8">
            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Subscription Terms
            </h4>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-xs text-blue-900 leading-relaxed">
              {subscriptionTerms}
            </div>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100">
          <h4 className="font-bold text-slate-800 text-sm mb-2">Terms & Notes</h4>
          <textarea
            className="w-full text-sm text-slate-600 border-none resize-none focus:ring-0 bg-transparent h-24"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderQuotationsHistory = () => (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="secondary" icon={ArrowLeft} onClick={() => setActiveTab('dashboard')}>
          Back to Editor
        </Button>
        <h1 className="text-2xl font-bold text-slate-800">Saved Quotations</h1>
      </div>

      <Card>
        {savedQuotes.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium text-slate-600">No quotations saved yet</p>
            <p className="text-sm">Create a quote in the dashboard and click "Save Quote" to see it here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">School Name</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {savedQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(quote.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {quote.customerName}
                      <div className="text-xs text-slate-400 font-normal">{quote.customerContact}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">
                      {quote.items.reduce((acc, i) => acc + i.quantity, 0)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
                      {formatMoney(quote.totals.total)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleLoadQuote(quote)}
                          title="View & Print"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          title="Delete"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );

  const renderSettingsView = () => {
    // Removed local state, now using hoisted state from App

    const handleAddItem = () => {
      if (!newItem.name || !newItem.price) return;
      const product = {
        id: Date.now(),
        name: newItem.name,
        price: parseFloat(newItem.price),
        category: newItem.category,
        description: newItem.description,
        paymentType: newItem.paymentType || 'Subscription'
      };
      setCatalog([...catalog, product]);
      setNewItem({ name: '', price: '', category: 'Hardware', description: '', paymentType: 'Subscription' });
    };

    const handleDeleteProduct = (id) => {
      setCatalog(catalog.filter(p => p.id !== id));
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="secondary" icon={ArrowLeft} onClick={() => setActiveTab('dashboard')}>
            Back
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Configuration</h1>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Company Information (Editable)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="text-sm font-medium text-slate-600">Company Name</label>
              <input
                value={companyInfo.name}
                onChange={e => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                className="w-full mt-1 border border-slate-300 rounded px-3 py-2"
              />
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium text-slate-600">Address</label>
              <textarea
                value={companyInfo.address}
                onChange={e => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                className="w-full mt-1 border border-slate-300 rounded px-3 py-2 h-[42px] resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Email</label>
              <input
                value={companyInfo.email}
                onChange={e => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                className="w-full mt-1 border border-slate-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Phone</label>
              <input
                value={companyInfo.phone}
                onChange={e => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                className="w-full mt-1 border border-slate-300 rounded px-3 py-2"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-slate-600">GSTIN</label>
              <input
                value={companyInfo.gstin}
                onChange={e => setCompanyInfo({ ...companyInfo, gstin: e.target.value })}
                className="w-full mt-1 border border-slate-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Terms & Conditions Configuration</h2>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-2 block">Document Title</label>
              <select
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Proforma Invoice">Proforma Invoice</option>
                <option value="Tax Invoice">Tax Invoice</option>
                <option value="Quotation">Quotation</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-2 block">Invoice Section Order</label>
              <select
                value={sectionOrder[0]}
                onChange={e => {
                  const first = e.target.value;
                  setSectionOrder(first === 'hardware' ? ['hardware', 'subscription'] : ['subscription', 'hardware']);
                }}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hardware">Hardware First</option>
                <option value="subscription">Subscription First</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">Hardware Discount (%)</label>
                <input
                  type="number"
                  value={hardwareDiscount}
                  onChange={e => setHardwareDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">Subscription Discount (%)</label>
                <input
                  type="number"
                  value={subscriptionDiscount}
                  onChange={e => setSubscriptionDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-2 block">Subscription Terms (Displayed in Blue Box)</label>
              <textarea
                value={subscriptionTerms}
                onChange={e => setSubscriptionTerms(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 h-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">This text appears in the blue notification box on the quote.</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-2 block">Default Terms & Notes</label>
              <textarea
                value={defaultNotes}
                onChange={e => setDefaultNotes(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 h-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">This is the default text for the "Terms & Notes" field when creating a new quote.</p>
            </div>
          </div>
        </Card >

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Product Catalog</h2>
            <span className="text-sm text-slate-500">{catalog.length} items active</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 space-y-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                <input
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Science Lab Kit"
                  className="w-full mt-1 border border-slate-300 rounded px-3 py-2"
                />
              </div>
              <div className="w-32">
                <label className="text-xs font-bold text-slate-500 uppercase">Price (₹)</label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full mt-1 border border-slate-300 rounded px-3 py-2"
                />
              </div>
              <div className="w-40">
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <select
                  value={newItem.category}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full mt-1 border border-slate-300 rounded px-3 py-2 bg-white"
                >
                  <option>Hardware</option>
                  <option>Software</option>
                  <option>Add-ons</option>
                  <option>Services</option>
                </select>
              </div>
              <div className="w-40">
                <label className="text-xs font-bold text-slate-500 uppercase">Payment Type</label>
                <select
                  value={newItem.paymentType}
                  onChange={e => setNewItem({ ...newItem, paymentType: e.target.value })}
                  className="w-full mt-1 border border-slate-300 rounded px-3 py-2 bg-white"
                >
                  <option value="Subscription">Subscription</option>
                  <option value="One-time Payment">One-time Payment</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Description / Details (Optional)</label>
                <input
                  value={newItem.description}
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="e.g. Dimensions, included software, etc."
                  className="w-full mt-1 border border-slate-300 rounded px-3 py-2"
                />
              </div>
              <Button onClick={handleAddItem} icon={Plus}>Add Product</Button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {catalog.map(product => (
              <div key={product.id} className="py-3 flex justify-between items-start group">
                <div>
                  <div className="font-medium text-slate-800">{product.name}</div>
                  {product.description && <div className="text-xs text-slate-500 mt-1">{product.description}</div>}
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-slate-400 inline-block bg-slate-100 px-1 rounded">{product.category}</span>
                    <span className={`text-xs px-1 rounded ${product.paymentType === 'One-time Payment' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {product.paymentType || 'Subscription'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-1">
                  <div className="font-mono text-slate-600">{formatMoney(product.price)}</div>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div >
    );
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden print:h-auto print:overflow-visible">
      <div className="print:hidden">
        {renderSidebar()}
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden print:h-auto print:overflow-visible print:block">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between md:hidden flex-shrink-0 print:hidden">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <span>BotClub</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 print:overflow-visible print:h-auto print:p-0">
          {activeTab === 'dashboard' && renderQuoteBuilder()}
          {activeTab === 'preview' && renderPrintPreview()}
          {activeTab === 'settings' && renderSettingsView()}
          {activeTab === 'history' && renderQuotationsHistory()}
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
