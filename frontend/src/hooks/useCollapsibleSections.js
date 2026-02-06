import { useState, useCallback } from 'react';

/**
 * useCollapsibleSections - Manages expand/collapse state with auto-progression
 * 
 * Features:
 * - Tracks which section is currently expanded
 * - Tracks which sections are completed
 * - Auto-expands next section when current is completed
 * - Allows re-expansion of completed sections
 */
const useCollapsibleSections = (sectionIds = []) => {
    const [expandedSection, setExpandedSection] = useState(sectionIds[0] || null);
    const [completedSections, setCompletedSections] = useState(new Set());

    const expandSection = useCallback((sectionId) => {
        setExpandedSection(sectionId);
    }, []);

    const collapseSection = useCallback((sectionId) => {
        if (expandedSection === sectionId) {
            setExpandedSection(null);
        }
    }, [expandedSection]);

    const toggleSection = useCallback((sectionId) => {
        setExpandedSection(prev => prev === sectionId ? null : sectionId);
    }, []);

    const markComplete = useCallback((sectionId, autoAdvance = true) => {
        setCompletedSections(prev => new Set([...prev, sectionId]));

        if (autoAdvance) {
            // Find next section index
            const currentIndex = sectionIds.indexOf(sectionId);
            const nextIndex = currentIndex + 1;

            if (nextIndex < sectionIds.length) {
                // Expand next section
                setExpandedSection(sectionIds[nextIndex]);
            } else {
                // All sections complete, collapse current
                setExpandedSection(null);
            }
        }
    }, [sectionIds]);

    const markIncomplete = useCallback((sectionId) => {
        setCompletedSections(prev => {
            const next = new Set(prev);
            next.delete(sectionId);
            return next;
        });
    }, []);

    const isExpanded = useCallback((sectionId) => {
        return expandedSection === sectionId;
    }, [expandedSection]);

    const isCompleted = useCallback((sectionId) => {
        return completedSections.has(sectionId);
    }, [completedSections]);

    const allCompleted = sectionIds.every(id => completedSections.has(id));

    const reset = useCallback(() => {
        setExpandedSection(sectionIds[0] || null);
        setCompletedSections(new Set());
    }, [sectionIds]);

    return {
        expandedSection,
        completedSections,
        expandSection,
        collapseSection,
        toggleSection,
        markComplete,
        markIncomplete,
        isExpanded,
        isCompleted,
        allCompleted,
        reset,
    };
};

export { useCollapsibleSections };
