import React from "react";

const FilterSection = (bets:any, setFiltered:any) => {
    const [searchUser, setSearchUser] = React.useState("");
    const [selectedSelection, setSelectedSelection] = React.useState("");
  
    const uniqueSelections = Array.from(new Set(bets.map((b:any) => b.selectionName)));
  
    React.useEffect(() => {
      let filtered = bets;
      if (selectedSelection)
        filtered = filtered.filter((b:any) => b.selectionName === selectedSelection);
      if (searchUser)
        filtered = filtered.filter((b:any) =>
          b.userName?.toLowerCase().includes(searchUser.toLowerCase())
        );
      setFiltered(filtered);
    }, [searchUser, selectedSelection]);
  
    return (
      <div className="flex gap-4 py-3 items-center border-b mb-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Selection:</label>
          <select
            className="ml-2 border rounded px-2 py-1"
            value={selectedSelection}
            onChange={(e) => setSelectedSelection(e.target.value)}
          >
            <option value="">All</option>
            {uniqueSelections.map((sel:any) => (
              <option key={sel} value={sel}>
                {sel}
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label className="text-sm font-medium text-gray-700">Username:</label>
          <input
            type="text"
            placeholder="Search username"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          />
        </div>
      </div>
    );
  };
  
export default FilterSection;