export const totalEmailAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId"
        from "emailAutomation"
        group by "automationId"
    ) as e
    on "e"."automationId"="a"."id"
    where a."createdAt" BETWEEN ? and ?
;
`;

export const successEmailAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId",

        SUM(
            (
                CASE 
                    WHEN status='success' THEN 0
                    ELSE 1
                END
            )
        ) as status

        from "emailAutomation"
        group by "automationId"
    ) as e
    on "e"."automationId"="a"."id"
    WHERE 1=1
    and e.status = 0
    and a."createdAt" BETWEEN ? and ?
;
`;
