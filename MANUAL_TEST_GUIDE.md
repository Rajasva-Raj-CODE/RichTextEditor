# Manual Testing Guide - Complete Editor Testing

## 🎯 Test Objective
Create comprehensive test content using ALL editor features to verify full functionality.

---

## 📝 Test Content Creation Plan

### Step 1: Basic Text Entry ✅
1. Open http://localhost:3000
2. Click in the editor
3. Type: "This is a comprehensive test of the text editor"
4. **Verify:** Text appears in editor

### Step 2: Headings ✅
1. Select "This is a comprehensive test"
2. Click Heading dropdown → Select "Heading 1"
3. **Verify:** Text becomes large heading
4. Press Enter, type "Section One"
5. Select "Section One"
6. Apply Heading 2
7. **Verify:** Smaller heading
8. Repeat for H3, H4, H5, H6
9. **Verify:** Each level has different size

### Step 3: Text Formatting ✅
1. Type new paragraph: "Formatting Test"
2. Select text
3. Click **Bold** button (Ctrl+B)
4. **Verify:** Text becomes bold
5. Click **Italic** button (Ctrl+I)
6. **Verify:** Text becomes bold AND italic
7. Click **Underline** button (Ctrl+U)
8. **Verify:** Text has underline
9. Click **Strikethrough** button
10. **Verify:** Text has strikethrough
11. Type new text: "Clear Format"
12. Apply all formatting
13. Click **Remove Formatting** button
14. **Verify:** All formatting removed

### Step 4: Subscript & Superscript ✅
1. Type: "H2O"
2. Select "2"
3. Click **Subscript** button
4. **Verify:** "2" appears below baseline (H₂O)
5. Type: "E=mc2"
6. Select "2"
7. Click **Superscript** button
8. **Verify:** "2" appears above baseline (E=mc²)

### Step 5: Font Controls ✅
1. Type: "Font Testing"
2. Select text
3. Test **Font Size:**
   - Click Font Size dropdown
   - Select "12px"
   - **Verify:** Text becomes very small
   - Select "32px"
   - **Verify:** Text becomes very large
   - Select "16px"
   - **Verify:** Text returns to normal

4. Test **Font Family:**
   - Click Font Family dropdown
   - Select "Arial"
   - **Verify:** Font changes to Arial
   - Select "Times New Roman"
   - **Verify:** Font changes to serif font
   - Select "Monaco"
   - **Verify:** Font changes to monospace
   - Select "System default"
   - **Verify:** Font returns to default

5. Test **Letter Spacing:**
   - Type: "SPACING TEST"
   - Select text
   - Click Letter Spacing dropdown
   - Select "2px"
   - **Verify:** Letters spread apart
   - Select "0"
   - **Verify:** Letters return to normal

6. Test **Line Height:**
   - Type two lines of text
   - Select both lines
   - Click Line Height dropdown
   - Select "2"
   - **Verify:** Lines spread vertically
   - Select "1.5"
   - **Verify:** Lines return to normal

### Step 6: Text Alignment ✅
1. Type several sentences
2. Click **Align Left** button
3. **Verify:** Text aligns to left
4. Click **Align Center** button
5. **Verify:** Text centers
6. Click **Align Right** button
7. **Verify:** Text aligns to right
8. Click **Justify** button
9. **Verify:** Text spreads evenly across width

### Step 7: Lists ✅
1. Create **Bullet List:**
   - Click Bullet List button
   - Type: "First item"
   - Press Enter
   - Type: "Second item"
   - Press Enter
   - Type: "Third item"
   - **Verify:** Bullet points appear

2. Create **Ordered List:**
   - Click Ordered List button
   - Type: "Step 1"
   - Press Enter
   - Type: "Step 2"
   - Press Enter
   - Type: "Step 3"
   - **Verify:** Numbers appear (1, 2, 3)

3. Create **Task List:**
   - Click Task List button
   - Type: "Task 1"
   - Press Enter
   - Type: "Task 2"
   - **Verify:** Checkboxes appear
   - Click checkboxes
   - **Verify:** Tasks get checked off

4. Test **Nested Lists:**
   - In bullet list, place cursor at end of first item
   - Press Tab (or click Indent button)
   - Type: "Sub-item"
   - **Verify:** Indented bullet appears
   - Click Outdent button
   - **Verify:** Item returns to main level

### Step 8: Colors ✅
1. Type: "Color Test"
2. Select text
3. Test **Text Color:**
   - Click Text Color button (palette icon)
   - Select different colors
   - **Verify:** Text color changes
   - Try multiple colors

4. Test **Highlight Color:**
   - Type: "Highlight Test"
   - Select text
   - Click Highlight button (highlighter icon)
   - Select yellow color
   - **Verify:** Background gets highlighted
   - Try different highlight colors

### Step 9: Links ✅
1. Type: "Visit Google"
2. Select "Google"
3. Click **Link** button
4. **Verify:** Link dialog opens
5. Enter URL: "https://www.google.com"
6. Click "Insert" or press Enter
7. **Verify:** Text becomes clickable link
8. Click the link
9. **Verify:** Opens in new tab
10. Select the link again
11. Click Link button
12. **Verify:** Dialog shows existing URL
13. Change URL to "https://www.github.com"
14. Click "Update"
15. **Verify:** Link updates
16. Remove URL completely
17. Click "Update"
18. **Verify:** Link is removed

### Step 10: Images ✅
1. Test **Insert Image by URL:**
   - Click **Image** button
   - **Verify:** Image dialog opens
   - Enter URL: "https://via.placeholder.com/400x300"
   - Click "Insert"
   - **Verify:** Image appears in editor
   - Click image
   - **Verify:** Image can be selected

2. Test **Upload Image:**
   - Click Image button again
   - Click "Upload Image" section
   - Click file input
   - Select an image file (< 10MB)
   - **Verify:** Image uploads and appears
   - Try invalid file (e.g., .txt)
   - **Verify:** Error message appears
   - Try file > 10MB
   - **Verify:** Size limit error appears

### Step 11: Tables ✅
1. Click **Table** button
2. **Verify:** Table dialog opens
3. Set Rows: 3, Columns: 4
4. Click "Insert"
5. **Verify:** 3x4 table appears
6. Click inside table
7. **Verify:** Table controls bar appears

8. Test **Row Operations:**
   - Click "Row Before" button
   - **Verify:** Row added above
   - Click "Row After" button
   - **Verify:** Row added below
   - Select a row
   - Click "Delete Row"
   - **Verify:** Row removed

9. Test **Column Operations:**
   - Click "Col Before" button
   - **Verify:** Column added before
   - Click "Col After" button
   - **Verify:** Column added after
   - Select a column
   - Click "Delete Col"
   - **Verify:** Column removed

10. Test **Cell Operations:**
    - Select multiple cells
    - Click "Merge Cells"
    - **Verify:** Cells merge
    - Click "Split Cell"
    - **Verify:** Cell splits
    - Click "Delete Table"
    - **Verify:** Entire table removed

### Step 12: Blockquote ✅
1. Type several sentences
2. Select all
3. Click **Quote** button (blockquote)
4. **Verify:** Text becomes indented with quote style
5. Click Quote button again
6. **Verify:** Quote formatting removed

### Step 13: Code Block ✅
1. Click **Code Block** button
2. Type: `console.log("Hello World");`
3. **Verify:** Text appears in monospace code format
4. Click Code Block button again
5. **Verify:** Code formatting removed

### Step 14: Horizontal Rule ✅
1. Place cursor at end of document
2. Click **Horizontal Rule** button (minus icon)
3. **Verify:** Horizontal line appears
4. Type below line
5. **Verify:** Content separated by line

### Step 15: Emoji Picker ✅
1. Click **Emoji** button (😊 icon)
2. **Verify:** Emoji picker dialog opens
3. Select an emoji (e.g., 😀)
4. **Verify:** Emoji inserted at cursor
5. Select another emoji
6. **Verify:** Another emoji inserted

### Step 16: Find & Replace ✅
1. Type several sentences with repeated words
2. Click **Find & Replace** button (search icon)
3. **Verify:** Find/Replace dialog opens
4. Enter "test" in Find field
5. Enter "TEST" in Replace field
6. Click "Replace All"
7. **Verify:** All instances replaced
8. Check document
9. **Verify:** All "test" changed to "TEST"

### Step 17: Undo/Redo ✅
1. Type: "Original text"
2. Apply formatting
3. Click **Undo** button (or Ctrl+Z)
4. **Verify:** Formatting removed
5. Click Undo again
6. **Verify:** Text returns
7. Click **Redo** button (or Ctrl+Y)
8. **Verify:** Text reappears
9. Click Redo again
10. **Verify:** Formatting reapplies

### Step 18: Export Functions ✅
1. Create comprehensive content with:
   - Headings
   - Formatted text
   - Lists
   - Links
   - Images
   - Tables

2. Test **Export to PDF:**
   - Click File dropdown
   - Select "Export as PDF"
   - **Verify:** File downloads as "document.pdf"
   - Open PDF
   - **Verify:** Content appears correctly

3. Test **Export to Word:**
   - Click File dropdown
   - Select "Export as Word"
   - **Verify:** File downloads as "document.docx"
   - Open DOCX
   - **Verify:** Content and formatting preserved

### Step 19: Import Function ✅
1. Prepare a Word document (.docx) with:
   - Headings
   - Formatted text
   - Lists

2. Test **Import Word:**
   - Click File dropdown
   - Select "Import Word"
   - **Verify:** File picker opens
   - Select Word document
   - **Verify:** Content imports to editor
   - **Verify:** Formatting preserved

3. Test **Import Plain Text:**
   - Create a .txt file
   - Import it
   - **Verify:** Text imports correctly

### Step 20: Clear Document ✅
1. Create content in editor
2. Click **Clear** button (trash icon)
3. **Verify:** All content removed
4. Type new text
5. **Verify:** Editor works with fresh content

### Step 21: Source View ✅
1. Create content with formatting
2. Click **Source View** button (eye icon)
3. **Verify:** Dialog opens showing HTML source
4. Edit HTML directly
5. Click "Apply Changes"
6. **Verify:** Editor updates with changes
7. Click Cancel
8. Click Source View again
9. **Verify:** Changes not applied if cancelled

### Step 22: Dark Mode ✅
1. Click **Theme Toggle** button (moon/sun icon)
2. **Verify:** Page switches to dark mode
3. **Verify:** Editor remains visible
4. Click again
5. **Verify:** Returns to light mode
6. **Verify:** Theme preference persists (if implemented)

### Step 23: Zoom Controls ✅
1. Click **Zoom In** button (+)
2. **Verify:** Editor content zooms in
3. Click multiple times
4. **Verify:** Continues zooming
5. Click **Zoom Out** button (-)
6. **Verify:** Content zooms out
7. **Verify:** Text remains readable at all zoom levels

### Step 24: Footer Statistics ✅
1. Type content in editor
2. Check bottom of editor
3. **Verify:** Word count displays
4. **Verify:** Character count displays
5. Add more text
6. **Verify:** Statistics update in real-time
7. Remove text
8. **Verify:** Statistics decrease

### Step 25: Autosave ✅
1. Type content in editor
2. Wait 1 second (500ms delay)
3. Open browser DevTools → Application → Local Storage
4. **Verify:** "tiptap-editor-content" key exists
5. **Verify:** Contains HTML of editor content
6. Refresh page (F5)
7. **Verify:** Content restores automatically
8. Clear localStorage manually
9. Refresh page
10. **Verify:** Editor is empty

### Step 26: Combined Features Test ✅
Create comprehensive document with ALL features:

```
# Main Title (H1)

## Section Title (H2)

**Bold text** and *italic text* with <u>underline</u> and ~~strikethrough~~.

H₂O (subscript) and E=mc² (superscript)

**Font Testing:**
- Size: 12px, 16px, 24px, 32px
- Family: Arial, Times New Roman, Monaco
- Letter Spacing: -0.5px, 0, 2px
- Line Height: 1, 1.5, 2

- Bullet list item 1
- Bullet list item 2
  - Nested item

1. Numbered item 1
2. Numbered item 2

- [ ] Unchecked task
- [x] Checked task

[Visit Google](https://www.google.com)

![Image](https://via.placeholder.com/400x300)

| Table | Header | Row |
|-------|--------|-----|
| Cell 1 | Cell 2 | Cell 3 |
| Cell 4 | Cell 5 | Cell 6 |

> This is a blockquote

`console.log("Code block");`

---

😀 😂 🎉 Emojis inserted

Color: Red text with yellow highlight
```

### Step 27: Edge Cases ✅
1. **Empty Document:**
   - Clear editor
   - Try all formatting buttons
   - **Verify:** No errors occur

2. **Long Text:**
   - Paste large amount of text (1000+ words)
   - **Verify:** Editor handles smoothly
   - **Verify:** Statistics calculate correctly

3. **Special Characters:**
   - Type: `!@#$%^&*()_+-=[]{}|;':\",./<>?`
   - **Verify:** All characters display correctly

4. **Copy/Paste:**
   - Copy formatted text from external source
   - Paste into editor
   - **Verify:** Formatting handled correctly

5. **Keyboard Shortcuts:**
   - Test all keyboard shortcuts
   - **Verify:** Each shortcut works
   - Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y, etc.

## ✅ Final Verification Checklist

After completing all tests, verify:

- [ ] All toolbar buttons work
- [ ] All dialogs open and close correctly
- [ ] All formatting applies correctly
- [ ] Export functions generate files
- [ ] Import functions work correctly
- [ ] Autosave works and restores content
- [ ] Statistics update correctly
- [ ] Dark mode toggles properly
- [ ] Zoom controls work
- [ ] No console errors appear
- [ ] No visual glitches
- [ ] All features accessible via UI
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive (if applicable)

## 🐛 Common Issues to Watch For

1. **Formatting Not Applying:**
   - Check if text is selected
   - Verify button is active
   - Check console for errors

2. **Dialog Not Closing:**
   - Click cancel button
   - Click outside dialog
   - Press Escape key

3. **Export Not Working:**
   - Check browser download permissions
   - Verify content exists in editor
   - Check console for errors

4. **Import Not Working:**
   - Verify file format (.docx, .txt)
   - Check file size limits
   - Check console for errors

5. **Autosave Not Working:**
   - Check browser localStorage permissions
   - Verify delay has passed
   - Check console for errors

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Feature                 | Status  | Notes
------------------------|---------|-------------------
Basic Text Entry        | ✅/❌   |
Headings                | ✅/❌   |
Text Formatting         | ✅/❌   |
Font Controls           | ✅/❌   |
Alignment               | ✅/❌   |
Lists                   | ✅/❌   |
Colors                  | ✅/❌   |
Links                   | ✅/❌   |
Images                  | ✅/❌   |
Tables                  | ✅/❌   |
Blockquote              | ✅/❌   |
Code Block              | ✅/❌   |
Emoji Picker            | ✅/❌   |
Find & Replace          | ✅/❌   |
Undo/Redo               | ✅/❌   |
Export PDF              | ✅/❌   |
Export Word             | ✅/❌   |
Import Word             | ✅/❌   |
Clear Document          | ✅/❌   |
Source View             | ✅/❌   |
Dark Mode               | ✅/❌   |
Zoom Controls           | ✅/❌   |
Footer Statistics       | ✅/❌   |
Autosave                | ✅/❌   |

Overall Status: ✅ PASS / ❌ FAIL

Issues Found:
1. 
2. 
3. 
```

---

**🎯 Goal:** Complete ALL 27 steps above and verify every feature works correctly!

