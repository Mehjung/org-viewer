1.0 [x] füge oben eine suchleiste ein (rundes Input Feld mit Lupen icon) verwende
fuzzy search und zeige eine Auswahl der gefundenen Elemente unter der searchbar (ausklappbares Feld) an, wenn ein Eintrag ausgewählt wird springe zu dem gefundenen node
(Logik alle nodes löschen dann den gefundenen aktivieren wenn es geht schnell Algorithmus variante ansonsten rekursiv öffnen)

## Implementation Details
- **Search Input**: Round input field with magnifying glass icon added to header
- **Fuzzy Search**: Custom algorithm with scoring for relevance
- **Dropdown Results**: Up to 8 results with highlighted search terms
- **Keyboard Navigation**: Arrow keys, Enter to select, Escape to close
- **Auto Navigation**: Finds path to node, expands parents, scrolls to target
- **Performance**: Minimum 2 chars, limited results, efficient algorithms

## Important Fixes/Handling
- Used existing `allNodes()` function for search corpus
- Integrated with existing `expanded` Set and selection patterns
- Added proper event handling for focus/blur and keyboard interaction
- Implemented fuzzy scoring with exact substring prioritization
- Added automatic scrolling and centering of found nodes

### Bug Fixes (User-Reported):
- **Keyboard Navigation**: Fixed function naming conflict that prevented arrow key navigation
- **Path Highlighting**: Fixed `sel` type mismatch - system expects ID string, not node object
- **Selection Logic**: Corrected path building to use IDs directly instead of relying on pos map

## Relevant Files
- **index.html**: Main implementation with CSS and JavaScript
- **test/task-searchbar/searchbar.test.js**: Comprehensive test suite
- **test/task-searchbar/test-report.md**: Implementation documentation