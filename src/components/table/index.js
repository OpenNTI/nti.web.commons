import List from './list-table/ListTable'; //deprecated
import Panel from './Table';
import Header from './TableHeader';
import Row from './TableRow';

export {
	//Backwards compat
	List as ListTable,
	Panel as Table,
	Header as TableHeader,
	Row as TableRow,
	// Cleaner names:
	List,
	Panel,
	Header,
	Row,
};

export * from './Constants';
