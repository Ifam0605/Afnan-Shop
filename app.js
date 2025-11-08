// Three-Wheeler Shop Billing & Inventory App - JavaScript

/**
 * STORAGE STRUCTURE:
 * localStorage keys:
 * - 'threeWheel_items': Array of wheel objects {id, model, year, vehicleNumber, color, chassisNumber, engineNumber, notes, purchasePrice, addedDate}
 * - 'threeWheel_sales': Array of sale objects {id, wheelId, saleDate, sellingPrice, paymentMethod, buyerName, buyerAddress, buyerNIC, buyerPhone, saleNotes}
 * 
 * Admin toggle state stored in localStorage as 'threeWheel_adminToggle' (boolean)
 * Current sale for bill generation stored in 'threeWheel_currentSale' (object)
 */

// ==================== STORAGE FUNCTIONS ====================

/**
 * Load wheels from localStorage
 * @returns {Array} Array of wheel objects
 */
function loadWheels() {
    const data = localStorage.getItem('threeWheel_items');
    return data ? JSON.parse(data) : [];
}

/**
 * Save wheels to localStorage
 * @param {Array} wheels - Array of wheel objects
 */
function saveWheels(wheels) {
    localStorage.setItem('threeWheel_items', JSON.stringify(wheels));
}

/**
 * Load sales from localStorage
 * @returns {Array} Array of sale objects
 */
function loadSales() {
    const data = localStorage.getItem('threeWheel_sales');
    return data ? JSON.parse(data) : [];
}

/**
 * Save sales to localStorage
 * @param {Array} sales - Array of sale objects
 */
function saveSales(sales) {
    localStorage.setItem('threeWheel_sales', JSON.stringify(sales));
}

/**
 * Get admin toggle state from localStorage
 * @returns {boolean} Admin toggle state
 */
function getAdminToggle() {
    const state = localStorage.getItem('threeWheel_adminToggle');
    return state === 'true';
}

/**
 * Save admin toggle state to localStorage
 * @param {boolean} state - Admin toggle state
 */
function saveAdminToggle(state) {
    localStorage.setItem('threeWheel_adminToggle', state.toString());
}

/**
 * Seed demo data on first run
 * Creates sample wheels and sales for demonstration
 */
function seedDemoData() {
    const wheels = [
        {
            id: 'wheel_' + Date.now() + '_1',
            model: 'Bajaj Auto Rickshaw',
            year: 2022,
            vehicleNumber: 'ABC-1234',
            color: 'Red',
            chassisNumber: 'CH123456789',
            engineNumber: 'EN987654321',
            notes: 'Good condition, low mileage',
            purchasePrice: 85000,
            addedDate: '2024-01-15'
        },
        {
            id: 'wheel_' + Date.now() + '_2',
            model: 'Mahindra Alfa',
            year: 2023,
            vehicleNumber: 'XYZ-5678',
            color: 'Blue',
            chassisNumber: 'CH987654321',
            engineNumber: 'EN123456789',
            notes: 'New model, excellent condition',
            purchasePrice: 92000,
            addedDate: '2024-02-10'
        },
        {
            id: 'wheel_' + Date.now() + '_3',
            model: 'Piaggio Ape',
            year: 2021,
            vehicleNumber: 'DEF-9012',
            color: 'White',
            chassisNumber: 'CH456789123',
            engineNumber: 'EN789123456',
            notes: 'Used, needs minor repairs',
            purchasePrice: 75000,
            addedDate: '2024-03-05'
        },
        {
            id: 'wheel_' + Date.now() + '_4',
            model: 'TVS King',
            year: 2023,
            vehicleNumber: 'GHI-3456',
            color: 'Black',
            chassisNumber: 'CH789123456',
            engineNumber: 'EN456789123',
            notes: 'Brand new, showroom condition',
            purchasePrice: 98000,
            addedDate: '2024-03-20'
        }
    ];

    const sales = [
        {
            id: 'sale_' + Date.now() + '_1',
            wheelId: wheels[0].id,
            saleDate: '2024-02-01',
            sellingPrice: 95000,
            paymentMethod: 'Ready Cash',
            buyerName: 'Ahmed Khan',
            buyerAddress: '123 Main Street, Karachi',
            buyerNIC: '42101-1234567-1',
            buyerPhone: '0300-1234567',
            saleNotes: 'Sold to regular customer'
        },
        {
            id: 'sale_' + Date.now() + '_2',
            wheelId: wheels[1].id,
            saleDate: '2024-03-15',
            sellingPrice: 105000,
            paymentMethod: 'Finance (Leasing)',
            buyerName: 'Fatima Ali',
            buyerAddress: '456 Park Avenue, Lahore',
            buyerNIC: '35202-9876543-2',
            buyerPhone: '0312-9876543',
            saleNotes: 'Quick sale, finance approved'
        }
    ];

    saveWheels(wheels);
    saveSales(sales);
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId(prefix = 'item') {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return 'Rs. ' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * Show confirmation dialog
 * @param {string} message - Confirmation message
 * @returns {boolean} User confirmation
 */
function confirmAction(message) {
    return confirm(message);
}

/**
 * Show alert message
 * @param {string} message - Alert message
 */
function showAlert(message) {
    alert(message);
}

// ==================== WHEEL MANAGEMENT ====================

let editingWheelId = null;

/**
 * Get available wheels (not sold)
 * @returns {Array} Array of available wheel objects
 */
function getAvailableWheels() {
    const wheels = loadWheels();
    const sales = loadSales();
    const soldWheelIds = new Set(sales.map(sale => sale.wheelId));
    return wheels.filter(wheel => !soldWheelIds.has(wheel.id));
}

/**
 * Get sold wheel IDs
 * @returns {Set} Set of sold wheel IDs
 */
function getSoldWheelIds() {
    const sales = loadSales();
    return new Set(sales.map(sale => sale.wheelId));
}

/**
 * Render wheels list
 */
function renderWheels() {
    const wheels = loadWheels();
    const container = document.getElementById('wheelsContainer');
    const soldIds = getSoldWheelIds();

    if (wheels.length === 0) {
        container.innerHTML = '<div class="empty-state">No wheels in inventory</div>';
        return;
    }

    container.innerHTML = wheels.map(wheel => {
        const isSold = soldIds.has(wheel.id);
        return `
            <div class="wheel-item ${isSold ? 'sold' : ''}">
                <div class="wheel-info">
                    <strong>${wheel.model}</strong>
                    <div>Year: ${wheel.year} | Color: ${wheel.color || 'N/A'} | Vehicle No: ${wheel.vehicleNumber || 'N/A'}</div>
                    <div>Chassis: ${wheel.chassisNumber || 'N/A'} | Engine: ${wheel.engineNumber || 'N/A'}</div>
                    <div>Added: ${formatDate(wheel.addedDate)}</div>
                    ${wheel.notes ? `<div>Notes: ${wheel.notes}</div>` : ''}
                    ${isSold ? '<div style="color: #e74c3c; font-weight: bold;">SOLD</div>' : ''}
                </div>
                <div class="wheel-actions">
                    ${!isSold ? `<button onclick="editWheel('${wheel.id}')" class="secondary">Edit</button>` : ''}
                    <button onclick="deleteWheel('${wheel.id}')" class="danger">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Reset wheel form
 */
function resetWheelForm() {
    document.getElementById('wheelForm').reset();
    document.getElementById('wheelId').value = '';
    document.getElementById('saveWheelBtn').textContent = 'Add Wheel';
    document.getElementById('cancelWheelBtn').style.display = 'none';
    editingWheelId = null;
}

/**
 * Edit wheel
 * @param {string} wheelId - Wheel ID to edit
 */
function editWheel(wheelId) {
    const wheels = loadWheels();
    const wheel = wheels.find(w => w.id === wheelId);
    
    if (!wheel) {
        showAlert('Wheel not found');
        return;
    }

    editingWheelId = wheelId;
    document.getElementById('wheelId').value = wheelId;
    document.getElementById('model').value = wheel.model;
    document.getElementById('year').value = wheel.year;
    document.getElementById('vehicleNumber').value = wheel.vehicleNumber || '';
    document.getElementById('color').value = wheel.color || '';
    document.getElementById('chassisNumber').value = wheel.chassisNumber || '';
    document.getElementById('engineNumber').value = wheel.engineNumber || '';
    document.getElementById('purchasePrice').value = wheel.purchasePrice;
    document.getElementById('notes').value = wheel.notes || '';
    document.getElementById('saveWheelBtn').textContent = 'Update Wheel';
    document.getElementById('cancelWheelBtn').style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.wheel-management').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Delete wheel
 * @param {string} wheelId - Wheel ID to delete
 */
function deleteWheel(wheelId) {
    if (!confirmAction('Are you sure you want to delete this wheel? This action cannot be undone.')) {
        return;
    }

    const wheels = loadWheels();
    const sales = loadSales();
    
    // Check if wheel has been sold
    const hasSale = sales.some(sale => sale.wheelId === wheelId);
    if (hasSale) {
        if (!confirmAction('This wheel has been sold. Deleting it will also remove the sale record. Continue?')) {
            return;
        }
        // Remove associated sales
        const filteredSales = sales.filter(sale => sale.wheelId !== wheelId);
        saveSales(filteredSales);
    }

    const filteredWheels = wheels.filter(w => w.id !== wheelId);
    saveWheels(filteredWheels);
    
    renderWheels();
    renderSales();
    updateWheelSelect();
    renderReport();
    showAlert('Wheel deleted successfully');
}

/**
 * Handle wheel form submission
 */
function handleWheelSubmit(e) {
    e.preventDefault();

    const wheelId = document.getElementById('wheelId').value;
    const model = document.getElementById('model').value.trim();
    const year = parseInt(document.getElementById('year').value);
    const vehicleNumber = document.getElementById('vehicleNumber').value.trim();
    const color = document.getElementById('color').value.trim();
    const chassisNumber = document.getElementById('chassisNumber').value.trim();
    const engineNumber = document.getElementById('engineNumber').value.trim();
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const notes = document.getElementById('notes').value.trim();

    // Validation
    if (!model) {
        showAlert('Model is required');
        return;
    }

    if (isNaN(year) || year < 1900 || year > 2100) {
        showAlert('Please enter a valid year');
        return;
    }

    if (!vehicleNumber) {
        showAlert('Vehicle Number is required');
        return;
    }

    if (!color) {
        showAlert('Color is required');
        return;
    }

    if (!chassisNumber) {
        showAlert('Chassis Number is required');
        return;
    }

    if (!engineNumber) {
        showAlert('Engine Number is required');
        return;
    }

    if (isNaN(purchasePrice) || purchasePrice <= 0) {
        showAlert('Purchase price must be greater than 0');
        return;
    }

    const wheels = loadWheels();

    if (wheelId && editingWheelId) {
        // Update existing wheel
        const index = wheels.findIndex(w => w.id === wheelId);
        if (index !== -1) {
            wheels[index] = {
                ...wheels[index],
                model,
                year,
                vehicleNumber,
                color,
                chassisNumber,
                engineNumber,
                purchasePrice,
                notes
            };
            saveWheels(wheels);
            showAlert('Wheel updated successfully');
        }
    } else {
        // Add new wheel
        const newWheel = {
            id: generateId('wheel'),
            model,
            year,
            vehicleNumber,
            color,
            chassisNumber,
            engineNumber,
            notes,
            purchasePrice,
            addedDate: getTodayDate()
        };
        wheels.push(newWheel);
        saveWheels(wheels);
        showAlert('Wheel added successfully');
    }

    resetWheelForm();
    renderWheels();
    updateWheelSelect();
}

// ==================== SALES MANAGEMENT ====================

/**
 * Update wheel select dropdown with available wheels
 */
function updateWheelSelect() {
    const availableWheels = getAvailableWheels();
    const select = document.getElementById('wheelSelect');
    
    select.innerHTML = '<option value="">-- Select a wheel --</option>';
    
    availableWheels.forEach(wheel => {
        const option = document.createElement('option');
        option.value = wheel.id;
        option.textContent = `${wheel.model} (${wheel.year}) - ${wheel.color || 'N/A'} - ${wheel.vehicleNumber || 'N/A'}`;
        select.appendChild(option);
    });
}

/**
 * Render sales list
 */
function renderSales() {
    const sales = loadSales();
    const wheels = loadWheels();
    const container = document.getElementById('salesContainer');

    if (sales.length === 0) {
        container.innerHTML = '<div class="empty-state">No sales recorded</div>';
        return;
    }

    // Sort by date (newest first)
    const sortedSales = [...sales].sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));

    container.innerHTML = sortedSales.map(sale => {
        const wheel = wheels.find(w => w.id === sale.wheelId);
        const wheelName = wheel ? `${wheel.model} (${wheel.year})` : 'Unknown Wheel';
        
        return `
            <div class="sale-item">
                <div class="sale-info">
                    <strong>${wheelName}</strong>
                    <div>Buyer: ${sale.buyerName || 'N/A'} | Payment: ${sale.paymentMethod || 'N/A'}</div>
                    <div>Sale Date: ${formatDate(sale.saleDate)} | Price: ${formatCurrency(sale.sellingPrice)}</div>
                    ${sale.saleNotes ? `<div>Notes: ${sale.saleNotes}</div>` : ''}
                    <button onclick="generateBill('${sale.id}')" class="bill-btn" style="margin-top: 10px;">Generate Bill</button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Handle sale form submission
 */
function handleSaleSubmit(e) {
    e.preventDefault();

    const wheelId = document.getElementById('wheelSelect').value;
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const paymentMethod = document.getElementById('paymentMethod').value;
    const buyerName = document.getElementById('buyerName').value.trim();
    const buyerAddress = document.getElementById('buyerAddress').value.trim();
    const buyerNIC = document.getElementById('buyerNIC').value.trim();
    const buyerPhone = document.getElementById('buyerPhone').value.trim();
    const saleDate = document.getElementById('saleDate').value;
    const saleNotes = document.getElementById('saleNotes').value.trim();

    // Validation
    if (!wheelId) {
        showAlert('Please select a wheel');
        return;
    }

    if (isNaN(sellingPrice) || sellingPrice <= 0) {
        showAlert('Selling price must be greater than 0');
        return;
    }

    if (!paymentMethod) {
        showAlert('Payment method is required');
        return;
    }

    if (!buyerName) {
        showAlert('Buyer name is required');
        return;
    }

    if (!buyerAddress) {
        showAlert('Buyer address is required');
        return;
    }

    if (!buyerNIC) {
        showAlert('Buyer NIC number is required');
        return;
    }

    if (!buyerPhone) {
        showAlert('Buyer phone number is required');
        return;
    }

    if (!saleDate) {
        showAlert('Sale date is required');
        return;
    }

    // Check if wheel is already sold
    const sales = loadSales();
    const alreadySold = sales.some(sale => sale.wheelId === wheelId);
    if (alreadySold) {
        showAlert('This wheel has already been sold');
        return;
    }

    // Create sale record
    const newSale = {
        id: generateId('sale'),
        wheelId,
        saleDate,
        sellingPrice,
        paymentMethod,
        buyerName,
        buyerAddress,
        buyerNIC,
        buyerPhone,
        saleNotes
    };

    sales.push(newSale);
    saveSales(sales);

    // Store current sale for bill generation
    localStorage.setItem('threeWheel_currentSale', JSON.stringify(newSale));
    
    showAlert('Sale recorded successfully');
    
    // Reset form
    document.getElementById('saleForm').reset();
    document.getElementById('saleDate').value = getTodayDate();
    
    // Show bill section
    document.getElementById('billSection').style.display = 'block';
    
    renderSales();
    renderWheels();
    updateWheelSelect();
    renderReport();
}

// ==================== REPORTS ====================

let currentReportData = [];

/**
 * Render sales report
 */
function renderReport() {
    const sales = loadSales();
    const wheels = loadWheels();
    const fromDate = document.getElementById('reportFromDate').value;
    const toDate = document.getElementById('reportToDate').value;
    const showPurchasePrice = getAdminToggle();

    // Filter sales by date range
    let filteredSales = sales;
    
    if (fromDate) {
        filteredSales = filteredSales.filter(sale => sale.saleDate >= fromDate);
    }
    
    if (toDate) {
        filteredSales = filteredSales.filter(sale => sale.saleDate <= toDate);
    }

    // Enrich sales with wheel data
    currentReportData = filteredSales.map(sale => {
        const wheel = wheels.find(w => w.id === sale.wheelId);
        return {
            ...sale,
            wheel: wheel || null,
            model: wheel ? wheel.model : 'Unknown',
            purchasePrice: wheel ? wheel.purchasePrice : 0,
            profit: wheel ? sale.sellingPrice - wheel.purchasePrice : sale.sellingPrice
        };
    });

    // Render table
    const tbody = document.getElementById('reportTableBody');
    const tfoot = document.getElementById('reportTableFooter');
    const purchasePriceCol = document.querySelector('.purchase-price-col');

    // Toggle purchase price column visibility
    if (showPurchasePrice) {
        purchasePriceCol.style.display = '';
    } else {
        purchasePriceCol.style.display = 'none';
    }

    if (currentReportData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #999;">No sales found for the selected date range</td></tr>';
        tfoot.innerHTML = '';
        return;
    }

    // Render table rows
    tbody.innerHTML = currentReportData.map(item => {
        return `
            <tr>
                <td>${item.model}</td>
                <td>${formatCurrency(item.sellingPrice)}</td>
                ${showPurchasePrice ? `<td>${formatCurrency(item.purchasePrice)}</td>` : ''}
                <td style="color: ${item.profit >= 0 ? '#27ae60' : '#e74c3c'}; font-weight: 600;">
                    ${formatCurrency(item.profit)}
                </td>
            </tr>
        `;
    }).join('');

    // Calculate summary totals
    const count = currentReportData.length;
    const totalRevenue = currentReportData.reduce((sum, item) => sum + item.sellingPrice, 0);
    const totalCost = currentReportData.reduce((sum, item) => sum + item.purchasePrice, 0);
    const totalProfit = totalRevenue - totalCost;

    // Render summary footer
    tfoot.innerHTML = `
        <tr>
            <td><strong>Summary</strong></td>
            <td><strong>${formatCurrency(totalRevenue)}</strong></td>
            ${showPurchasePrice ? `<td><strong>${formatCurrency(totalCost)}</strong></td>` : ''}
            <td style="color: ${totalProfit >= 0 ? '#27ae60' : '#e74c3c'};">
                <strong>${formatCurrency(totalProfit)}</strong>
            </td>
        </tr>
        <tr>
            <td><strong>Count: ${count}</strong></td>
            <td colspan="${showPurchasePrice ? '3' : '2'}"></td>
        </tr>
    `;
}

/**
 * Filter report by date range
 */
function filterReport() {
    renderReport();
}

/**
 * Export report to CSV
 */
function exportToCSV() {
    if (currentReportData.length === 0) {
        showAlert('No data to export');
        return;
    }

    const showPurchasePrice = getAdminToggle();
    
    // CSV headers
    let headers = ['Model', 'Selling Price', 'Sale Date'];
    if (showPurchasePrice) {
        headers.splice(2, 0, 'Purchase Price');
    }
    headers.push('Profit');

    // Build CSV content
    let csvContent = headers.join(',') + '\n';

    currentReportData.forEach(item => {
        let row = [
            `"${item.model}"`,
            item.sellingPrice,
            item.saleDate
        ];
        
        if (showPurchasePrice) {
            row.splice(2, 0, item.purchasePrice);
        }
        
        row.push(item.profit);
        csvContent += row.join(',') + '\n';
    });

    // Add summary row
    const count = currentReportData.length;
    const totalRevenue = currentReportData.reduce((sum, item) => sum + item.sellingPrice, 0);
    const totalCost = currentReportData.reduce((sum, item) => sum + item.purchasePrice, 0);
    const totalProfit = totalRevenue - totalCost;

    csvContent += '\n';
    csvContent += 'Summary\n';
    csvContent += `Count,${count}\n`;
    csvContent += `Total Revenue,${totalRevenue}\n`;
    if (showPurchasePrice) {
        csvContent += `Total Cost,${totalCost}\n`;
    }
    csvContent += `Total Profit,${totalProfit}\n`;

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-report-${getTodayDate()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('Report exported to CSV successfully');
}

// ==================== ADMIN TOGGLE ====================

/**
 * Handle admin toggle change
 */
function handleAdminToggle() {
    const toggle = document.getElementById('adminToggle');
    saveAdminToggle(toggle.checked);
    renderReport();
}

// ==================== BACKUP & RESTORE ====================

/**
 * Export all data to JSON
 */
function exportToJSON() {
    const data = {
        wheels: loadWheels(),
        sales: loadSales(),
        exportDate: new Date().toISOString()
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `three-wheeler-backup-${getTodayDate()}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('Data exported to JSON successfully');
}

/**
 * Import data from JSON
 */
function importFromJSON() {
    const input = document.getElementById('importFileInput');
    input.click();
}

/**
 * Handle file import
 */
function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            
            if (!confirmAction('This will replace all current data. Are you sure?')) {
                return;
            }

            if (data.wheels && Array.isArray(data.wheels)) {
                saveWheels(data.wheels);
            }

            if (data.sales && Array.isArray(data.sales)) {
                saveSales(data.sales);
            }

            showAlert('Data imported successfully');
            
            // Refresh all displays
            renderWheels();
            renderSales();
            updateWheelSelect();
            renderReport();
        } catch (error) {
            showAlert('Error importing file. Please check the file format.');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
}

/**
 * Reset to demo data
 */
function resetDemoData() {
    if (!confirmAction('This will delete all current data and restore demo data. Are you sure?')) {
        return;
    }

    localStorage.removeItem('threeWheel_items');
    localStorage.removeItem('threeWheel_sales');
    
    seedDemoData();
    
    showAlert('Demo data restored successfully');
    
    // Refresh all displays
    renderWheels();
    renderSales();
    updateWheelSelect();
    renderReport();
}

// ==================== PDF BILL GENERATION ====================

/**
 * Generate bill for a sale
 * @param {string} saleId - Sale ID to generate bill for
 */
function generateBill(saleId) {
    const sales = loadSales();
    const wheels = loadWheels();
    const sale = sales.find(s => s.id === saleId);
    
    if (!sale) {
        showAlert('Sale not found');
        return;
    }
    
    const wheel = wheels.find(w => w.id === sale.wheelId);
    if (!wheel) {
        showAlert('Wheel information not found');
        return;
    }
    
    // Store current sale for bill generation
    localStorage.setItem('threeWheel_currentSale', JSON.stringify(sale));
    
    // Show bill section
    document.getElementById('billSection').style.display = 'block';
    document.getElementById('billSection').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Download bill as PDF
 */
function downloadBillPDF() {
    const saleData = localStorage.getItem('threeWheel_currentSale');
    if (!saleData) {
        showAlert('No sale selected for bill generation');
        return;
    }
    
    const sale = JSON.parse(saleData);
    const wheels = loadWheels();
    const wheel = wheels.find(w => w.id === sale.wheelId);
    
    if (!wheel) {
        showAlert('Wheel information not found');
        return;
    }
    
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        showAlert('PDF library not loaded. Please refresh the page.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Store name
    const storeName = 'Afnan Motors';
    
    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(storeName, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Billing & Inventory Management', 105, 28, { align: 'center' });
    doc.text('Sale Receipt', 105, 35, { align: 'center' });
    
    // Line separator
    doc.line(20, 40, 190, 40);
    
    let yPos = 50;
    
    // Vehicle Information
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Vehicle Information', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Model: ${wheel.model}`, 20, yPos);
    yPos += 7;
    doc.text(`Year: ${wheel.year}`, 20, yPos);
    yPos += 7;
    doc.text(`Color: ${wheel.color || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`Vehicle Number: ${wheel.vehicleNumber || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`Chassis Number: ${wheel.chassisNumber || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`Engine Number: ${wheel.engineNumber || 'N/A'}`, 20, yPos);
    yPos += 10;
    
    // Buyer Information
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Buyer Information', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${sale.buyerName || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`Address: ${sale.buyerAddress || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`NIC Number: ${sale.buyerNIC || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`Phone: ${sale.buyerPhone || 'N/A'}`, 20, yPos);
    yPos += 10;
    
    // Sale Information
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Sale Information', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Sale Date: ${formatDate(sale.saleDate)}`, 20, yPos);
    yPos += 7;
    doc.text(`Payment Method: ${sale.paymentMethod || 'N/A'}`, 20, yPos);
    yPos += 7;
    
    // Selling Price (highlighted)
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Selling Price: ${formatCurrency(sale.sellingPrice)}`, 20, yPos);
    yPos += 10;
    
    // Notes
    if (sale.saleNotes) {
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Notes: ${sale.saleNotes}`, 20, yPos);
        yPos += 10;
    }
    
    // Footer
    yPos = 270;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    doc.text('Thank you for your business with Afnan Motors!', 105, yPos, { align: 'center' });
    doc.text(`Generated on: ${formatDate(getTodayDate())}`, 105, yPos + 7, { align: 'center' });
    
    // Download PDF
    const fileName = `Bill_${sale.buyerName.replace(/\s+/g, '_')}_${sale.saleDate}.pdf`;
    doc.save(fileName);
    
    showAlert('Bill downloaded successfully');
}

/**
 * Print bill
 */
function printBill() {
    const saleData = localStorage.getItem('threeWheel_currentSale');
    if (!saleData) {
        showAlert('No sale selected for bill generation');
        return;
    }
    
    const sale = JSON.parse(saleData);
    const wheels = loadWheels();
    const wheel = wheels.find(w => w.id === sale.wheelId);
    
    if (!wheel) {
        showAlert('Wheel information not found');
        return;
    }
    
    // Create printable HTML
    const printWindow = window.open('', '_blank');
    const storeName = 'Afnan Motors';
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bill - ${storeName}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #1e3c72;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #1e3c72;
                    margin: 0;
                    font-size: 28px;
                }
                .section {
                    margin-bottom: 25px;
                }
                .section-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #1e3c72;
                    margin-bottom: 10px;
                    border-bottom: 2px solid #2a5298;
                    padding-bottom: 5px;
                }
                .info-row {
                    margin: 8px 0;
                    font-size: 14px;
                }
                .price {
                    font-size: 18px;
                    font-weight: bold;
                    color: #1e3c72;
                    margin-top: 10px;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #ccc;
                    text-align: center;
                    font-style: italic;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${storeName}</h1>
                <p>Billing & Inventory Management</p>
                <p><strong>Sale Receipt</strong></p>
            </div>
            
            <div class="section">
                <div class="section-title">Vehicle Information</div>
                <div class="info-row"><strong>Model:</strong> ${wheel.model}</div>
                <div class="info-row"><strong>Year:</strong> ${wheel.year}</div>
                <div class="info-row"><strong>Color:</strong> ${wheel.color || 'N/A'}</div>
                <div class="info-row"><strong>Vehicle Number:</strong> ${wheel.vehicleNumber || 'N/A'}</div>
                <div class="info-row"><strong>Chassis Number:</strong> ${wheel.chassisNumber || 'N/A'}</div>
                <div class="info-row"><strong>Engine Number:</strong> ${wheel.engineNumber || 'N/A'}</div>
            </div>
            
            <div class="section">
                <div class="section-title">Buyer Information</div>
                <div class="info-row"><strong>Name:</strong> ${sale.buyerName || 'N/A'}</div>
                <div class="info-row"><strong>Address:</strong> ${sale.buyerAddress || 'N/A'}</div>
                <div class="info-row"><strong>NIC Number:</strong> ${sale.buyerNIC || 'N/A'}</div>
                <div class="info-row"><strong>Phone:</strong> ${sale.buyerPhone || 'N/A'}</div>
            </div>
            
            <div class="section">
                <div class="section-title">Sale Information</div>
                <div class="info-row"><strong>Sale Date:</strong> ${formatDate(sale.saleDate)}</div>
                <div class="info-row"><strong>Payment Method:</strong> ${sale.paymentMethod || 'N/A'}</div>
                <div class="price">Selling Price: ${formatCurrency(sale.sellingPrice)}</div>
                ${sale.saleNotes ? `<div class="info-row" style="margin-top: 10px;"><strong>Notes:</strong> ${sale.saleNotes}</div>` : ''}
            </div>
            
            <div class="footer">
                <p>Thank you for your business!</p>
                <p>Generated on: ${formatDate(getTodayDate())}</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load, then print
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// ==================== INITIALIZATION ====================

/**
 * Initialize the application
 */
function init() {
    // Check if data exists, if not seed demo data
    const wheels = loadWheels();
    if (wheels.length === 0) {
        seedDemoData();
    }

    // Set up admin toggle
    const adminToggle = document.getElementById('adminToggle');
    adminToggle.checked = getAdminToggle();
    adminToggle.addEventListener('change', handleAdminToggle);

    // Set up wheel form
    document.getElementById('wheelForm').addEventListener('submit', handleWheelSubmit);
    document.getElementById('cancelWheelBtn').addEventListener('click', resetWheelForm);

    // Set up sale form
    document.getElementById('saleForm').addEventListener('submit', handleSaleSubmit);
    document.getElementById('saleDate').value = getTodayDate();

    // Set up report filters
    document.getElementById('filterReportBtn').addEventListener('click', filterReport);
    document.getElementById('exportCSVBtn').addEventListener('click', exportToCSV);

    // Set up backup/restore
    document.getElementById('exportJSONBtn').addEventListener('click', exportToJSON);
    document.getElementById('importJSONBtn').addEventListener('click', importFromJSON);
    document.getElementById('importFileInput').addEventListener('change', handleFileImport);
    document.getElementById('resetDemoBtn').addEventListener('click', resetDemoData);

    // Set up PDF bill generation
    document.getElementById('downloadBillBtn').addEventListener('click', downloadBillPDF);
    document.getElementById('printBillBtn').addEventListener('click', printBill);

    // Initial render
    renderWheels();
    renderSales();
    updateWheelSelect();
    renderReport();
}

// Make functions globally available for onclick handlers
window.editWheel = editWheel;
window.deleteWheel = deleteWheel;
window.generateBill = generateBill;

// ==================== NAVIGATION MENU ====================

/**
 * Initialize navigation menu
 */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu on hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        initNavigation();
    });
} else {
    init();
    initNavigation();
}

