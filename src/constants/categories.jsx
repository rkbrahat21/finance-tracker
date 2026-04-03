import React from 'react';
import {
    Briefcase, Heart, Layers,
    Utensils, Shirt, Car, Home, Laptop, Wallet, CheckCircle2, PiggyBank
} from 'lucide-react';

export const INCOME_CATEGORIES = [
    { id: 'Salary', icon: <Briefcase size={18} />, label: 'Salary', subcategories: ['Monthly Pay', 'Bonus', 'Freelance', 'Others'] },
    { id: 'Father', icon: <Heart size={18} />, label: 'Father', subcategories: ['Monthly Support', 'Gift', 'Emergency', 'Others'] },
    { id: 'Debt settlement', icon: <CheckCircle2 size={18} />, label: 'Debt settlement', subcategories: ['Received'] },
    { id: 'Savings', icon: <PiggyBank size={18} />, label: 'Savings', subcategories: ['Withdrawal', 'Others'] },
    { id: 'Others', icon: <Wallet size={18} />, label: 'Others', subcategories: ['Cashback', 'Refund', 'Investment', 'Others'] }
];

export const EXPENSE_CATEGORIES = [
    { id: 'Food', icon: <Utensils size={18} />, label: 'Food', subcategories: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks', 'Others'] },
    { id: 'Clothes', icon: <Shirt size={18} />, label: 'Clothes', subcategories: ['Shirt', 'Panjabi', 'Pants', 'Shoes', 'Accessories', 'Others'] },
    { id: 'Transport', icon: <Car size={18} />, label: 'Transport', subcategories: ['Uber', 'Bus', 'CNG', 'Fuel', 'Others'] },
    { id: 'Rent', icon: <Home size={18} />, label: 'Rent', subcategories: ['Apartment', 'Utilities', 'Internet', 'Others'] },
    { id: 'Gadgets', icon: <Laptop size={18} />, label: 'Gadgets', subcategories: ['Phone', 'Laptop', 'Headphones', 'Accessories', 'Others'] },
    { id: 'Debt settlement', icon: <CheckCircle2 size={18} />, label: 'Debt settlement', subcategories: ['Paid'] },
    { id: 'Others', icon: <Layers size={18} />, label: 'Others', subcategories: ['Entertainment', 'Health', 'Education', 'Personal', 'Others'] }
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const getCategoryIcon = (categoryId) => {
    const cat = ALL_CATEGORIES.find(c => c.id === categoryId);
    return cat ? cat.icon : <Layers size={18} />;
};

export const getCategoryColor = (categoryId) => {
    const colors = {
        Food: '#F59E0B',      // Amber
        Clothes: '#EC4899',   // Pink
        Transport: '#3B82F6', // Blue
        Rent: '#8B5CF6',      // Purple
        Gadgets: '#10B981',   // Emerald
        Others: '#64748B',    // Slate
        Salary: '#22C55E',    // Green
        Father: '#F43F5E',     // Rose
        Savings: '#F59E0B',    // Amber
        'Debt settlement': '#0EA5E9' // Light Blue
    };
    return colors[categoryId] || '#94A3B8';
};
