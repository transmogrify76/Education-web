// src/contexts/ParentContext.js
import React, { createContext, useState, useContext } from 'react';

const ParentContext = createContext();

export const ParentProvider = ({ children }) => {
    const [parentId, setParentId] = useState(null);

    return (
        <ParentContext.Provider value={{ parentId, setParentId }}>
            {children}
        </ParentContext.Provider>
    );
};

export const useParent = () => useContext(ParentContext);
