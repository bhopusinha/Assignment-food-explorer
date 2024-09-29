import React, { useState, useCallback, MouseEvent } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
  applyNodeChanges,
  applyEdgeChanges,
  BezierEdge,
  EdgeProps,
  NodeChange,
  EdgeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import { getCategories, getMealsByCategory, getMealDetails, getIngredients, getTags } from '../api';
import Sidebar from './Sidebar';
import { Category, Meal, MealDetails } from '../types';

const initialNodes: Node[] = [
  { id: '1', position: { x: 250, y: 0 }, data: { label: 'Explore' }, type: 'input' },
];

const CustomEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => (
  <BezierEdge
    id={id}
    source={source}
    target={target}
    sourceX={sourceX}
    sourceY={sourceY}
    targetX={targetX}
    targetY={targetY}
    sourcePosition={sourcePosition}
    targetPosition={targetPosition}
    style={{ stroke: '#6c757d', strokeWidth: 2, ...style }}
    markerEnd={markerEnd}
  />
);

const edgeTypes = {
  custom: CustomEdge,
};

const NodeGraph: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<MealDetails | null>(null);

  const onNodesChange = useCallback(
    (changes:NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes:EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, type: 'custom' }, eds)),
    []
  );

  const onNodeClick = async (event: MouseEvent, node: Node) => {
    if (node.data.label === 'Explore') {
      const categories = await getCategories();
      const categoryNodes = categories.slice(0, 5).map((category: Category, index: number) => ({
        id: `category-${index + 1}`,
        position: { x: 250, y: 75 * (index + 1) },
        data: { label: category.strCategory },
      }));
      setNodes((nds) => [...nds, ...categoryNodes]);
    } else if (node.id.startsWith('category')) {
      const category = node.data.label;
      const meals = await getMealsByCategory(category);
      const mealNodes = meals.slice(0, 5).map((meal: Meal, index: number) => ({
        id: `meal-${category}-${index + 1}`,
        position: { x: 500, y: 75 * (index + 1) },
        data: { label: meal.strMeal },
      }));
      setNodes((nds) => [...nds, ...mealNodes]);
    } else if (node.id.startsWith('meal')) {
      const mealName = node.data.label;
      const mealDetails = await getMealDetails(mealName);
      const ingredients = await getIngredients(mealDetails.idMeal);
      const tags = await getTags(mealDetails.idMeal);

      const ingredientNodes = ingredients.map((ingredient: string, index: number) => ({
        id: `ingredient-${mealName}-${index + 1}`,
        position: { x: 750, y: 75 * (index + 1) },
        data: { label: ingredient },
      }));

      const tagNodes = tags.map((tag: string, index: number) => ({
        id: `tag-${mealName}-${index + 1}`,
        position: { x: 750, y: 75 * (ingredients.length + index + 1) },
        data: { label: tag },
      }));

      const mealDetailNode = {
        id: `meal-detail-${mealName}`,
        position: { x: 750, y: 75 * (ingredients.length + tags.length + 1) },
        data: { label: 'View Details' },
      };

      setNodes((nds) => [...nds, ...ingredientNodes, ...tagNodes, mealDetailNode]);
      setSelectedMeal(mealDetails);
    }
  };

  const closeSidebar = () => {
    setSelectedMeal(null);
  };

  return (
    <div className="h-screen flex">
      <div className="w-3/4 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          edgeTypes={edgeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      {selectedMeal && <Sidebar meal={selectedMeal} onClose={closeSidebar} />}
    </div>
  );
};

export default NodeGraph;
