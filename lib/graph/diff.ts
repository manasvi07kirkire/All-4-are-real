import { GraphDiffResult, GraphNodeData, GraphSnapshotData, NodeDiff } from "./types";

export function diffGraphSnapshots(
  prevSnapshot: GraphSnapshotData,
  currSnapshot: GraphSnapshotData
): GraphDiffResult {
  const prevNodesMap = new Map<string, GraphNodeData>(prevSnapshot.nodes.map((n) => [n.url, n]));
  const currNodesMap = new Map<string, GraphNodeData>(currSnapshot.nodes.map((n) => [n.url, n]));

  const addedNodes: GraphNodeData[] = [];
  const removedNodes: GraphNodeData[] = [];
  const changedNodes: NodeDiff[] = [];
  const regressedNodeIds: string[] = [];

  // Check added & changed
  currNodesMap.forEach((currNode, url) => {
    const prevNode = prevNodesMap.get(url);

    if (!prevNode) {
      addedNodes.push(currNode);
      if (currNode.health === "REGRESSION") {
        regressedNodeIds.push(currNode.id);
      }
    } else {
      const propertyDeltas: { property: string; before: any; after: any }[] = [];

      // Check key properties
      if (prevNode.attrs.hasCanonical !== currNode.attrs.hasCanonical) {
        propertyDeltas.push({
          property: "hasCanonical",
          before: prevNode.attrs.hasCanonical,
          after: currNode.attrs.hasCanonical,
        });
      }
      if (prevNode.attrs.isNoindexed !== currNode.attrs.isNoindexed) {
        propertyDeltas.push({
          property: "isNoindexed",
          before: prevNode.attrs.isNoindexed,
          after: currNode.attrs.isNoindexed,
        });
      }
      if (
        JSON.stringify(prevNode.attrs.schemaTypes || []) !==
        JSON.stringify(currNode.attrs.schemaTypes || [])
      ) {
        propertyDeltas.push({
          property: "schemaTypes",
          before: prevNode.attrs.schemaTypes,
          after: currNode.attrs.schemaTypes,
        });
      }

      const isChanged = propertyDeltas.length > 0 || prevNode.health !== currNode.health;
      if (isChanged) {
        changedNodes.push({
          nodeId: currNode.id,
          url: currNode.url,
          changeType: "CHANGED",
          healthBefore: prevNode.health,
          healthAfter: currNode.health,
          propertyDeltas,
        });
      }

      // Check if newly regressed
      if (prevNode.health === "PASS" && (currNode.health === "REGRESSION" || currNode.health === "DEGRADED")) {
        regressedNodeIds.push(currNode.id);
      }
    }
  });

  // Check removed
  prevNodesMap.forEach((prevNode, url) => {
    if (!currNodesMap.has(url)) {
      removedNodes.push(prevNode);
    }
  });

  return {
    previousDeploymentId: prevSnapshot.deploymentId,
    currentDeploymentId: currSnapshot.deploymentId,
    addedNodes,
    removedNodes,
    changedNodes,
    addedEdges: [],
    removedEdges: [],
    regressedNodeIds,
    totalAffectedPages: regressedNodeIds.length,
  };
}
