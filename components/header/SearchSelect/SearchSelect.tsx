"use client";

import { useMemo, useState, useEffect } from "react";
import Select, { components, SingleValue, StylesConfig } from "react-select";
import { useData, useSelection } from "@/context";
import { Folder } from "@/models/types/folder";
import { Website } from "@/models/types/website";
import styles from "./SearchSelect.module.css";
import Icon from "@/styles/Icons";

interface OptionType {
  value: string;
  label: string;
  type: "folder" | "website";
  item: Folder | Website;
  icon?: string;
}

// Custom option component with icon
const CustomOption = (props: any) => {
  const { data } = props;
  const isWebsite = data.type === "website";
  const website = isWebsite ? (data.item as Website) : null;
  const isIconUrl = website?.icon && website.icon.startsWith('http');

  return (
    <components.Option {...props}>
      <div className={styles.optionContent}>
        <div className={styles.optionIcon}>
          {isWebsite ? (
            website?.icon ? (
              isIconUrl ? (
                <img 
                  src={website.icon} 
                  alt="" 
                  className={styles.iconImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className={styles.iconEmoji}>{website.icon}</span>
              )
            ) : (
              <Icon type="siteTree" size={16} />
            )
          ) : (
            <Icon type="folderTree" size={16} />
          )}
        </div>
        <div className={styles.optionText}>
          <div className={styles.optionLabel}>{data.label}</div>
          <div className={styles.optionType}>
            {data.type === "folder" ? "Folder" : "Website"}
          </div>
        </div>
      </div>
    </components.Option>
  );
};

// Custom single value component with icon
const CustomSingleValue = (props: any) => {
  const { data } = props;
  const isWebsite = data.type === "website";
  const website = isWebsite ? (data.item as Website) : null;
  const isIconUrl = website?.icon && website.icon.startsWith('http');

  return (
    <components.SingleValue {...props}>
      <div className={styles.singleValueContent}>
        <div className={styles.singleValueIcon}>
          {isWebsite ? (
            website?.icon ? (
              isIconUrl ? (
                <img 
                  src={website.icon} 
                  alt="" 
                  className={styles.iconImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className={styles.iconEmoji}>{website.icon}</span>
              )
            ) : (
              <Icon type="siteTree" size={16} />
            )
          ) : (
            <Icon type="folderTree" size={16} />
          )}
        </div>
        <span>{data.label}</span>
      </div>
    </components.SingleValue>
  );
};

// Custom placeholder component with search icon
const CustomPlaceholder = (props: any) => {
  return (
    <components.Placeholder {...props}>
      <div className={styles.placeholderContent}>
        <Icon type="search" size={18} className={styles.searchIcon} />
        <span>{props.children}</span>
      </div>
    </components.Placeholder>
  );
};

export default function SearchSelect() {
  const { rootFolder } = useData();
  const { selectFolder, selectWebsite } = useSelection();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Build options from folder tree
  const options = useMemo(() => {
    const opts: OptionType[] = [];

    const traverseFolder = (folder: Folder, path: string[] = []) => {
      const currentPath = [...path, folder.name];
      
      // Add folder
      opts.push({
        value: `folder-${folder.id}`,
        label: currentPath.join(" > "),
        type: "folder",
        item: folder,
      });

      // Add websites in this folder
      if (folder.websites) {
        folder.websites.forEach((website) => {
          opts.push({
            value: `website-${website.id}`,
            label: website.title,
            type: "website",
            item: website,
            icon: website.icon || undefined,
          });
        });
      }

      // Traverse children
      if (folder.children) {
        folder.children.forEach((child) => {
          traverseFolder(child, currentPath);
        });
      }
    };

    if (rootFolder) {
      traverseFolder(rootFolder);
    }

    return opts;
  }, [rootFolder]);

  // Custom filter function that searches by description when input is > 5 chars
  const filterOption = (option: any, inputValue: string) => {
    if (!inputValue) return true;

    const searchText = inputValue.toLowerCase();
    const label = option.label.toLowerCase();
    
    // Always search by title/label
    if (label.includes(searchText)) {
      return true;
    }

    // If search text is more than 5 characters and it's a website, also search by description
    if (searchText.length > 5 && option.data.type === "website") {
      const website = option.data.item as Website;
      const description = website.description?.toLowerCase() || "";
      return description.includes(searchText);
    }

    return false;
  };

  const handleChange = (selected: SingleValue<OptionType>) => {
    if (!selected) return;

    if (selected.type === "folder") {
      selectFolder(selected.item as Folder);
    } else {
      selectWebsite(selected.item as Website);
    }
  };

  // Custom styles for react-select
  const customStyles: StylesConfig<OptionType, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderRadius: '8px',
      borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#3b82f6',
      },
    }),
    input: (base) => ({
      ...base,
      color: '#111827',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    }),
    menuList: (base) => ({
      ...base,
      padding: '4px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#f3f4f6' : 'transparent',
      color: '#111827',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '6px',
      '&:active': {
        backgroundColor: '#e5e7eb',
      },
    }),
  };

  // Show placeholder during SSR to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className={styles.searchSelectContainer}>
        <div className={styles.placeholderInput}>
          <Icon type="search" size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search folders and websites..."
            disabled
            readOnly
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.searchSelectContainer}>
      <Select<OptionType>
        options={options}
        onChange={handleChange}
        placeholder="Search folders and websites..."
        isClearable
        isSearchable
        filterOption={filterOption}
        components={{
          Option: CustomOption,
          SingleValue: CustomSingleValue,
          Placeholder: CustomPlaceholder,
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        styles={customStyles}
        className={styles.searchSelect}
        classNamePrefix="search-select"
        noOptionsMessage={() => "No results found"}
      />
    </div>
  );
}
