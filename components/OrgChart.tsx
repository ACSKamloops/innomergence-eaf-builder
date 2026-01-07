import React, { useState, useRef, useEffect } from 'react';
import { OrgNode, ICSType } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Plus, Trash2, Download, Users, ZoomIn, ZoomOut, Move, ChevronRight, ChevronDown, GripVertical, ArrowRight, CornerDownRight, Tag, RefreshCcw, Layout, FilePlus } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_DATA: OrgNode = {
  id: 'root',
  title: 'EOC Director',
  name: '',
  icsType: 'Director',
  children: [
    { id: 'info', title: 'Information Officer', name: '', children: [] },
    { id: 'liaison', title: 'Liaison Officer', name: '', children: [] },
    { id: 'safety', title: 'Safety Officer', name: '', children: [] },
    {
      id: 'ops', title: 'Operations Chief', name: '', icsType: 'Section', children: [
        { id: 'ops-b1', title: 'Branch I Director', name: '', icsType: 'Branch', children: [] }
      ]
    },
    { id: 'plan', title: 'Planning Chief', name: '', icsType: 'Section', children: [] },
    { id: 'log', title: 'Logistics Chief', name: '', icsType: 'Section', children: [] },
    { id: 'fin', title: 'Finance Chief', name: '', icsType: 'Section', children: [] },
  ]
};

const ICS_TEMPLATES: Record<string, OrgNode> = {
  "General": INITIAL_DATA,
  "Wildfire": {
    id: 'root', title: 'EOC Director', name: '', icsType: 'Director',
    children: [
      { id: 'info', title: 'Information Officer', name: '', children: [] },
      { id: 'liaison', title: 'Liaison Officer', name: '', children: [] },
      { 
        id: 'ops', title: 'Operations Chief', name: '', icsType: 'Section', children: [
          { id: 'fire-branch', title: 'Fire Branch', name: '', icsType: 'Branch', children: [] },
          { id: 'air-ops', title: 'Air Ops Branch', name: '', icsType: 'Branch', children: [] },
          { id: 'staging', title: 'Staging Area', name: '', icsType: 'Group', children: [] }
        ]
      },
      { 
        id: 'plan', title: 'Planning Chief', name: '', icsType: 'Section', children: [
          { id: 'res-unit', title: 'Resource Unit', name: '', icsType: 'Unit', children: [] },
          { id: 'sit-unit', title: 'Situation Unit', name: '', icsType: 'Unit', children: [] }
        ]
      },
      { id: 'log', title: 'Logistics Chief', name: '', icsType: 'Section', children: [] },
      { id: 'fin', title: 'Finance Chief', name: '', icsType: 'Section', children: [] },
    ]
  },
  "Flood": {
    id: 'root', title: 'EOC Director', name: '', icsType: 'Director',
    children: [
      { id: 'info', title: 'Information Officer', name: '', children: [] },
      { 
        id: 'ops', title: 'Operations Chief', name: '', icsType: 'Section', children: [
          { id: 'sandbag', title: 'Sandbag Group', name: '', icsType: 'Group', children: [] },
          { id: 'dike', title: 'Dike Patrol', name: '', icsType: 'Group', children: [] },
          { id: 'evac', title: 'Evacuation Branch', name: '', icsType: 'Branch', children: [] }
        ]
      },
      { 
        id: 'log', title: 'Logistics Chief', name: '', icsType: 'Section', children: [
           { id: 'supply', title: 'Supply Unit', name: '', icsType: 'Unit', children: [] },
           { id: 'transport', title: 'Ground Support', name: '', icsType: 'Unit', children: [] }
        ] 
      },
      { id: 'fin', title: 'Finance Chief', name: '', icsType: 'Section', children: [] },
    ]
  }
};

const ICS_TYPES: ICSType[] = ['Director', 'Section', 'Branch', 'Unit', 'Division', 'Group', 'Strike Team', 'Task Force'];

// --- Recursive Node Component ---
const OrgNodeComponent: React.FC<{
  node: OrgNode;
  parentId: string | null;
  onUpdate: (id: string, field: keyof OrgNode, value: string) => void;
  onAddChild: (id: string) => void;
  onAddSibling: (parentId: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (targetId: string) => void;
  depth: number;
}> = ({ node, parentId, onUpdate, onAddChild, onAddSibling, onDelete, onDragStart, onDragEnd, onDrop, depth }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  
  // Style based on depth - Updated for Innomergence Theme
  const getStyles = (d: number) => {
    if (d === 0) return "border-navy-700 bg-navy-800 text-white shadow-xl shadow-navy-800/20"; // Command
    if (d === 1) return "border-brand-500 bg-white shadow-lg shadow-brand-500/10";       // Chiefs
    if (d === 2) return "border-orange-400 bg-white shadow-lg shadow-orange-500/10";    // Branches
    return "border-gray-200 bg-white shadow-md shadow-gray-200/50";                    // Units
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onDrop(node.id);
  };

  const isDark = depth === 0;

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        draggable={true}
        onMouseDown={(e) => e.stopPropagation()} // CRITICAL: Prevents canvas panning when clicking node
        onDragStart={(e) => {
          e.stopPropagation();
          onDragStart(node.id);
        }}
        onDragEnd={(e) => {
          e.stopPropagation();
          onDragEnd();
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          "relative flex flex-col gap-1 p-3 rounded-2xl border-l-4 border-y border-r w-64 transition-all group z-10",
          getStyles(depth),
          isDragOver ? "ring-4 ring-brand-400 scale-105" : "hover:-translate-y-1 hover:shadow-xl"
        )}
      >
        {/* Grip Handle for Dragging implication */}
        <div className={clsx(
            "absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing",
            isDark ? "text-gray-400" : "text-gray-300"
        )}>
          <GripVertical size={14} />
        </div>

        <div className="pl-4 relative">
          {/* ICS Type Selector */}
          <div className="flex items-center gap-1.5 mb-1.5">
             <Tag size={10} className={isDark ? "text-gray-400" : "text-gray-400"} />
             <select 
                className={clsx(
                    "text-[10px] uppercase font-extrabold bg-transparent border-none p-0 focus:ring-0 cursor-pointer",
                    isDark ? "text-gray-300 hover:text-white" : "text-gray-400 hover:text-navy-700"
                )}
                value={node.icsType || (depth === 0 ? 'Director' : depth === 1 ? 'Section' : depth === 2 ? 'Branch' : 'Unit')}
                onChange={(e) => onUpdate(node.id, 'icsType', e.target.value)}
                onClick={(e) => e.stopPropagation()}
             >
                {ICS_TYPES.map(t => (
                  <option key={t} value={t} className="text-black">{t}</option>
                ))}
             </select>
          </div>

          <input
            className={clsx(
                "text-sm font-bold bg-transparent border-none focus:ring-0 uppercase tracking-wide w-full outline-none mb-1",
                isDark ? "text-white placeholder-gray-500" : "text-navy-700 placeholder-gray-300"
            )}
            value={node.title}
            placeholder="ROLE TITLE"
            onChange={(e) => onUpdate(node.id, 'title', e.target.value)}
          />
          <input
            className={clsx(
                "text-sm bg-transparent border-b border-dashed focus:outline-none py-0.5 w-full font-medium",
                isDark 
                    ? "text-gray-200 border-gray-600 focus:border-white placeholder-gray-600" 
                    : "text-gray-600 border-gray-200 focus:border-brand-500 placeholder-gray-300"
            )}
            value={node.name}
            placeholder="Unassigned"
            onChange={(e) => onUpdate(node.id, 'name', e.target.value)}
          />
        </div>

        {/* Action Buttons (Hover) */}
        <div className="absolute -right-3 -top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
           {/* Add Sibling (Only if not root) */}
           {parentId && (
            <button
              onClick={() => onAddSibling(parentId)}
              className="p-1.5 bg-white text-gray-500 rounded-full hover:bg-brand-50 hover:text-brand-600 shadow-md border border-gray-100"
              title="Add Peer (Beside)"
            >
              <ArrowRight size={14} />
            </button>
          )}
          {/* Add Child */}
          <button
            onClick={() => onAddChild(node.id)}
            className="p-1.5 bg-white text-gray-500 rounded-full hover:bg-emerald-50 hover:text-emerald-600 shadow-md border border-gray-100"
            title="Add Subordinate (Below)"
          >
            <CornerDownRight size={14} />
          </button>
          {/* Delete (Only if not root) */}
          {parentId && (
            <button
              onClick={() => onDelete(node.id)}
              className="p-1.5 bg-white text-gray-500 rounded-full hover:bg-red-50 hover:text-red-600 shadow-md border border-gray-100"
              title="Remove Role"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        {hasChildren && (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-white border border-gray-100 rounded-full p-1 shadow-md text-gray-400 hover:text-brand-600 hover:scale-110 transition-all"
          >
            {collapsed ? <ChevronDown size={14} /> : <ChevronRight size={14} className="-rotate-90" />}
          </button>
        )}
      </motion.div>

      {/* Children Tree Rendering */}
      <AnimatePresence>
        {!collapsed && hasChildren && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col items-center"
          >
            {/* Vertical line from parent to horizontal bar */}
            <div className="w-px h-8 bg-gray-300"></div>
            
            {/* Horizontal Bar Wrapper */}
            <div className="flex justify-center relative">
               {/* The Horizontal Line spanning children */}
               {node.children.length > 1 && (
                 <div className="absolute top-0 left-[50%] -translate-x-1/2 h-px bg-gray-300 w-[calc(100%-16rem)]"></div> 
               )}

              {/* Render Children */}
              <div className="flex gap-6 pt-0">
                {node.children.map((child, index) => (
                  <div key={child.id} className="flex flex-col items-center relative">
                    {/* Top Connector Lines (Pseudo-element replacement) */}
                    {/* Horizontal Connector */}
                    <div className={clsx(
                      "absolute top-0 h-px bg-gray-300",
                      node.children.length === 1 ? "w-0" : // Single child needs no horizontal bar
                      index === 0 ? "w-1/2 right-0 rounded-tl-lg" : // First child
                      index === node.children.length - 1 ? "w-1/2 left-0 rounded-tr-lg" : // Last child
                      "w-full" // Middle children
                    )}></div>
                    
                    {/* Vertical Connector to Child */}
                    <div className="w-px h-6 bg-gray-300"></div>
                    
                    <OrgNodeComponent
                      node={child}
                      parentId={node.id}
                      onUpdate={onUpdate}
                      onAddChild={onAddChild}
                      onAddSibling={onAddSibling}
                      onDelete={onDelete}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      onDrop={onDrop}
                      depth={depth + 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const OrgChart: React.FC<{ taskNumber: string, eventName?: string, operationalPeriod?: string }> = ({ taskNumber, eventName, operationalPeriod }) => {
  const [data, setData] = useState<OrgNode>(() => JSON.parse(JSON.stringify(INITIAL_DATA)));
  const [scale, setScale] = useState(1);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [rootKey, setRootKey] = useState(0); // Force remount on template change
  
  // Canvas Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPanning(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // --- Graph Operations ---

  const findNode = (root: OrgNode, id: string): OrgNode | null => {
    if (root.id === id) return root;
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const updateNode = (id: string, field: keyof OrgNode, value: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    const target = findNode(newData, id);
    if (target) {
      (target as any)[field] = value;
      setData(newData);
    }
  };

  const addChild = (parentId: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    const parent = findNode(newData, parentId);
    if (parent) {
      parent.children.push({
        id: Math.random().toString(36).substr(2, 9),
        title: 'New Position',
        name: '',
        children: []
      });
      setData(newData);
    }
  };

  const addSibling = (parentId: string) => {
    addChild(parentId); 
  };

  const deleteNode = (id: string) => {
    if (id === 'root') {
      alert("Cannot delete the EOC Director.");
      return;
    }
    if (!window.confirm("Delete this role and all subordinates?")) return;
    
    const remove = (node: OrgNode): OrgNode => {
      return {
        ...node,
        children: node.children.filter(c => c.id !== id).map(remove)
      };
    };
    setData(remove(data));
  };

  const handleReset = () => {
    if (window.confirm("Reset chart to default structure? All changes will be lost.")) {
      setData(JSON.parse(JSON.stringify(INITIAL_DATA)));
      setPosition({ x: 0, y: 0 });
      setScale(1);
      setRootKey(prev => prev + 1);
    }
  };

  const loadTemplate = (templateName: string) => {
    if (window.confirm(`Load ${templateName} template? This will overwrite your current chart.`)) {
      // Create a deep copy of the template to avoid mutation reference issues
      setData(JSON.parse(JSON.stringify(ICS_TEMPLATES[templateName])));
      setShowTemplates(false);
      setPosition({ x: 0, y: 0 });
      setScale(1);
      // Force component remount to ensure all node states (collapsed, etc) are reset
      setRootKey(prev => prev + 1);
    }
  };

  // --- Drag and Drop Logic ---
  const handleDragStart = (id: string) => {
    if (id === 'root') return; 
    setDraggedNodeId(id);
    setIsPanning(false); 
  };

  const handleDragEnd = () => {
    setDraggedNodeId(null);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedNodeId || draggedNodeId === targetId) return;
    
    const isChild = (parent: OrgNode, target: string): boolean => {
      return parent.children.some(c => c.id === target || isChild(c, target));
    };

    const draggedNodeFull = findNode(data, draggedNodeId);
    if (draggedNodeFull && isChild(draggedNodeFull, targetId)) {
      alert("Cannot move a supervisor into their own subordinate structure.");
      return;
    }

    const newData = JSON.parse(JSON.stringify(data));
    let draggedNodeObj: OrgNode | null = null;
    
    const removeFromParent = (node: OrgNode) => {
      const idx = node.children.findIndex(c => c.id === draggedNodeId);
      if (idx !== -1) {
        draggedNodeObj = node.children[idx];
        node.children.splice(idx, 1);
        return true;
      }
      return node.children.some(removeFromParent);
    };
    
    removeFromParent(newData);

    if (draggedNodeObj) {
      const targetNode = findNode(newData, targetId);
      if (targetNode) {
        targetNode.children.push(draggedNodeObj);
        setData(newData);
      }
    }
    
    setDraggedNodeId(null);
  };

  // --- Canvas Interaction ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('select')) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPosition({
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  // --- Export ---
  const handleExport = async () => {
    if (!contentRef.current) return;
    
    // Temporarily reset transform to ensure clean capture
    const originalTransform = contentRef.current.style.transform;
    contentRef.current.style.transform = "none";
    
    // Scale up for high DPI
    const canvas = await html2canvas(contentRef.current, { 
      scale: 3, 
      backgroundColor: "#ffffff",
      logging: false
    });
    
    contentRef.current.style.transform = originalTransform;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`ICS Organization Chart - ${eventName || 'Incident'}`, pdfWidth / 2, 15, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    const subHeader = `Task: ${taskNumber || 'N/A'}  |  Op Period: ${operationalPeriod || 'Unspecified'}`;
    pdf.text(subHeader, pdfWidth / 2, 22, { align: 'center' });

    const imgProps = pdf.getImageProperties(imgData);
    const ratio = Math.min((pdfWidth - 20) / imgProps.width, (pdfHeight - 40) / imgProps.height);
    pdf.addImage(imgData, 'PNG', (pdfWidth - imgProps.width * ratio)/2, 30, imgProps.width * ratio, imgProps.height * ratio);
    pdf.save(`ICS_Chart_${taskNumber || 'Draft'}.pdf`);
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F7FE] relative overflow-hidden rounded-2xl shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] border border-white print:h-screen print:w-screen print:absolute print:top-0 print:left-0 print:z-[100] print:bg-white">
      
      {/* Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-start pointer-events-none print:hidden">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md shadow-lg shadow-gray-200/50 border border-white p-2.5 rounded-2xl flex items-center gap-4">
          <div className="bg-brand-500 p-2 rounded-xl text-white shadow-lg shadow-brand-500/30">
            <Users size={20} />
          </div>
          <div>
             <h2 className="text-sm font-bold text-navy-700">Org Chart Builder</h2>
             <p className="text-[10px] text-gray-400 font-medium">Drag & Drop • Right-click to edit</p>
          </div>
          
          <div className="h-8 w-px bg-gray-100 mx-2"></div>

          {/* Templates Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-xs font-bold text-navy-700 border border-transparent hover:border-gray-100 transition-all"
            >
              <Layout size={14} />
              Templates
              <ChevronDown size={12} className="text-gray-400" />
            </button>

            {showTemplates && (
               <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-white overflow-hidden py-1 animate-in fade-in zoom-in-95 z-50">
                 <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">Select Preset</div>
                 {Object.keys(ICS_TEMPLATES).map(name => (
                   <button 
                    key={name} 
                    onClick={() => loadTemplate(name)}
                    className="w-full text-left px-4 py-3 text-xs font-bold text-navy-700 hover:bg-brand-50 hover:text-brand-600 flex items-center gap-2 border-b border-gray-50 last:border-none transition-colors"
                   >
                     <FilePlus size={14} className="text-gray-400" />
                     {name}
                   </button>
                 ))}
               </div>
            )}
          </div>
        </div>

        <div className="pointer-events-auto flex gap-3">
           {/* View Controls */}
           <div className="bg-white/90 backdrop-blur-md shadow-lg shadow-gray-200/50 border border-white p-2 rounded-2xl flex gap-1">
             <button onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-navy-700 transition-colors" title="Zoom In"><ZoomIn size={16} /></button>
             <button onClick={() => setScale(s => Math.max(s - 0.1, 0.3))} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-navy-700 transition-colors" title="Zoom Out"><ZoomOut size={16} /></button>
             <button onClick={() => {setPosition({x:0,y:0}); setScale(1);}} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-navy-700 transition-colors" title="Reset View"><Move size={16} /></button>
             <div className="w-px bg-gray-100 mx-1"></div>
             <button onClick={handleReset} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="Clear Chart">
               <RefreshCcw size={16} />
             </button>
           </div>
           
           <button onClick={handleExport} className="btn-primary text-xs shadow-lg shadow-brand-500/30">
             <Download size={14} /> Export PDF
           </button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] print:bg-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          ref={contentRef}
          className="min-h-full min-w-full flex items-center justify-center p-20 origin-center transition-transform duration-75 ease-out"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` 
          }}
        >
          <OrgNodeComponent 
            key={rootKey} // Force remount on template load
            node={data} 
            parentId={null}
            onUpdate={updateNode} 
            onAddChild={addChild} 
            onAddSibling={addSibling}
            onDelete={deleteNode} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            depth={0} 
          />
        </div>
      </div>

      {/* Legend Footer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg shadow-gray-200/50 border border-white flex gap-5 text-[10px] font-bold text-gray-500 pointer-events-none print:hidden">
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-navy-800"></div>Command</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-500"></div>Chiefs</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-400"></div>Branches</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200"></div>Units</span>
      </div>

    </div>
  );
};